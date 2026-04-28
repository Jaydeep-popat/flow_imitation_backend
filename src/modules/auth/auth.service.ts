import { Prisma, Role, TenantStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import {
	AppError,
	forbiddenError,
	unauthorizedError,
	validationError,
} from '../../common/errors/app-error';
import {
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_TTL_SECONDS,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_TTL_SECONDS,
} from '../../config/auth';
import prisma from '../../lib/prisma';
import { comparePassword, hashPassword } from '../../utils/password';
import { JwtPayload } from '../../types/auth.types';
import { areTokenHashesEqual, hashToken } from '../../utils/auth';

type RequestContext = {
	ipAddress?: string;
	userAgent?: string;
};

type TenantSummary = {
	id: string;
	name: string;
	slug: string;
	plan: string;
	status: TenantStatus;
};

type PublicUser = {
	id: string;
	name: string;
	email: string | null;
	phone: string;
	role: Role;
	tenant: TenantSummary | null;
};

type TokenBundle = {
	accessToken: string;
	refreshToken: string;
	refreshTokenId: string;
	accessTokenExpiresAt: Date;
	refreshTokenExpiresAt: Date;
	accessTokenMaxAgeMs: number;
	refreshTokenMaxAgeMs: number;
};

type LoginInput = {
	phone?: string;
	password: string;
};

type ChangePasswordInput = {
	currentPassword: string;
	newPassword: string;
};

const TENANT_ACCESS_ERROR_MESSAGE =
	'Your subscription has been suspended. Please contact Flowoid Technologies.';

const USER_PROFILE_INCLUDE = {
	id: true,
	name: true,
	email: true,
	phone: true,
	role: true,
	isActive: true,
	tenantMemberships: {
		where: { isActive: true },
		include: {
			tenant: true,
		},
		take: 1,
	},
} as const;

const USER_WITH_PASSWORD_SELECT = {
	...USER_PROFILE_INCLUDE,
	passwordHash: true,
} as const;

const ACCESS_TOKEN_MAX_AGE_MS = ACCESS_TOKEN_TTL_SECONDS * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = REFRESH_TOKEN_TTL_SECONDS * 1000;

type UserProfileRecord = Prisma.UserGetPayload<{
	select: typeof USER_PROFILE_INCLUDE;
}>;

type RefreshPayload = JwtPayload & {
	jti: string;
};

const normalizeTenantSummary = (
	tenant: UserProfileRecord['tenantMemberships'][number]['tenant'],
): TenantSummary => ({
	id: tenant.id,
	name: tenant.name,
	slug: tenant.slug,
	plan: tenant.plan,
	status: tenant.status,
});

const toPublicUser = (user: UserProfileRecord): PublicUser => ({
	id: user.id,
	name: user.name,
	email: user.email,
	phone: user.phone,
	role: user.role,
	tenant: user.role === 'SUPER_ADMIN'
		? null
		: user.tenantMemberships[0]
			? normalizeTenantSummary(user.tenantMemberships[0].tenant)
			: null,
});

const buildLoginPhone = (input: LoginInput): string => {
	const phone = input.phone?.trim();
	if (!phone) {
		throw validationError('Phone is required for login');
	}

	return phone;
};

const revokeSessionTokens = async (sessionId: string, reason: string): Promise<void> => {
	await prisma.authRefreshToken.updateMany({
		where: {
			sessionId,
			revokedAt: null,
		},
		data: {
			revokedAt: new Date(),
			revokedReason: reason,
		},
	});
};

const revokeUserRefreshTokens = async (userId: string, reason: string): Promise<void> => {
	await prisma.authRefreshToken.updateMany({
		where: {
			userId,
			revokedAt: null,
		},
		data: {
			revokedAt: new Date(),
			revokedReason: reason,
		},
	});
};

const issueTokensForUser = async (
	payload: JwtPayload,
	context: RequestContext,
	sessionId: string = randomUUID(),
): Promise<TokenBundle> => {
	const tokenId = randomUUID();
	const accessTokenExpiresAt = new Date(Date.now() + ACCESS_TOKEN_MAX_AGE_MS);
	const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);
	const tokenPayload: JwtPayload = {
		userId: payload.userId,
		role: payload.role,
		tenantId: payload.tenantId,
		sessionId,
	};
	const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_TTL_SECONDS,
	});
	const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_TTL_SECONDS,
		jwtid: tokenId,
	});

	await prisma.authRefreshToken.create({
		data: {
			id: tokenId,
			userId: payload.userId,
			tokenHash: hashToken(refreshToken),
			sessionId,
			userAgent: context.userAgent,
			ipAddress: context.ipAddress,
			expiresAt: refreshTokenExpiresAt,
		},
	});

	return {
		accessToken,
		refreshToken,
		refreshTokenId: tokenId,
		accessTokenExpiresAt,
		refreshTokenExpiresAt,
		accessTokenMaxAgeMs: ACCESS_TOKEN_MAX_AGE_MS,
		refreshTokenMaxAgeMs: REFRESH_TOKEN_MAX_AGE_MS,
	};
};

const verifyRefreshToken = (token: string): RefreshPayload => {
	try {
		const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshPayload;
		return decoded;
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw unauthorizedError('Refresh token has expired', 'REFRESH_TOKEN_EXPIRED');
		}

		if (error instanceof JsonWebTokenError) {
			throw unauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
		}

		throw error;
	}
};

const getTenantAccessContext = (
	user: UserProfileRecord,
	sessionId: string,
): JwtPayload => {
	if (user.role === 'SUPER_ADMIN') {
		return {
			userId: user.id,
			role: 'SUPER_ADMIN',
			tenantId: null,
			sessionId,
		};
	}

	const membership = user.tenantMemberships[0];
	if (!membership) {
		throw forbiddenError(
			'No active tenant membership found for this user',
			'TENANT_MEMBERSHIP_NOT_FOUND',
		);
	}

	if (
		membership.tenant.status !== 'ACTIVE' &&
		membership.tenant.status !== 'TRIAL'
	) {
		throw forbiddenError(
			TENANT_ACCESS_ERROR_MESSAGE,
			'TENANT_SUBSCRIPTION_INACTIVE',
		);
	}

	return {
		userId: user.id,
		role: membership.role,
		tenantId: membership.tenantId,
		sessionId,
	};
};

const getActiveUserById = async (userId: string): Promise<UserProfileRecord> => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: USER_PROFILE_INCLUDE,
	});

	if (!user) {
		throw unauthorizedError('User account was not found', 'USER_NOT_FOUND');
	}

	if (!user.isActive) {
		throw forbiddenError('User account is inactive', 'USER_INACTIVE');
	}

	if (user.role !== 'SUPER_ADMIN' && !user.tenantMemberships[0]) {
		throw forbiddenError(
			'No active tenant membership found for this user',
			'TENANT_MEMBERSHIP_NOT_FOUND',
		);
	}

	return user;
};

const purgeExpiredTokens = async (userId?: string): Promise<void> => {
	await prisma.authRefreshToken.deleteMany({
		where: {
			userId,
			expiresAt: {
				lt: new Date(),
			},
		},
	});
};

export const login = async (
	input: LoginInput,
	context: RequestContext,
): Promise<{ token: string; user: PublicUser; tokens: TokenBundle }> => {
	const phone = buildLoginPhone(input);
	const suppliedPassword = input.password;

	const user = await prisma.user.findFirst({
		where: {
			phone,
		},
		select: USER_WITH_PASSWORD_SELECT,
	});

	if (!user) {
		throw unauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
	}

	if (!user.isActive) {
		throw forbiddenError('User account is inactive', 'USER_INACTIVE');
	}

	const passwordMatches = await comparePassword(suppliedPassword, user.passwordHash);
	if (!passwordMatches) {
		throw unauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
	}

	await purgeExpiredTokens(user.id);

	const sessionId = randomUUID();
	const tenantContext = getTenantAccessContext(user, sessionId);
	const tokens = await issueTokensForUser(tenantContext, context, sessionId);

	return {
		token: tokens.accessToken,
		user: toPublicUser(user),
		tokens,
	};
};

export const refreshSession = async (
	refreshToken: string,
	context: RequestContext,
): Promise<{ token: string; user: PublicUser; tokens: TokenBundle }> => {
	const payload = verifyRefreshToken(refreshToken);

	const storedToken = await prisma.authRefreshToken.findUnique({
		where: { id: payload.jti },
		include: {
			user: {
				select: USER_PROFILE_INCLUDE,
			},
		},
	});

	if (!storedToken) {
		throw unauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
	}

	const providedHash = hashToken(refreshToken);
	if (
		storedToken.userId !== payload.userId ||
		storedToken.sessionId !== payload.sessionId ||
		!areTokenHashesEqual(storedToken.tokenHash, providedHash)
	) {
		await revokeSessionTokens(storedToken.sessionId, 'refresh_token_mismatch');
		throw unauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
	}

	if (storedToken.revokedAt) {
		await revokeSessionTokens(storedToken.sessionId, 'refresh_token_reuse_detected');
		throw new AppError(
			401,
			'Refresh token has already been used',
			'REFRESH_TOKEN_REUSED',
		);
	}

	if (storedToken.expiresAt <= new Date()) {
		await revokeSessionTokens(storedToken.sessionId, 'refresh_token_expired');
		throw unauthorizedError('Refresh token has expired', 'REFRESH_TOKEN_EXPIRED');
	}

	if (!storedToken.user.isActive) {
		await revokeSessionTokens(storedToken.sessionId, 'inactive_user_refresh_attempt');
		throw forbiddenError('User account is inactive', 'USER_INACTIVE');
	}

	const refreshedUser = await prisma.user.findUnique({
		where: { id: storedToken.user.id },
		select: USER_WITH_PASSWORD_SELECT,
	});

	if (!refreshedUser) {
		await revokeSessionTokens(storedToken.sessionId, 'user_missing_on_refresh');
		throw unauthorizedError('User account was not found', 'USER_NOT_FOUND');
	}

	if (!refreshedUser.isActive) {
		await revokeSessionTokens(storedToken.sessionId, 'inactive_user_refresh_attempt');
		throw forbiddenError('User account is inactive', 'USER_INACTIVE');
	}

	const refreshedContext =
		refreshedUser.role === 'SUPER_ADMIN'
			? {
				userId: refreshedUser.id,
				role: 'SUPER_ADMIN' as const,
				tenantId: null,
				sessionId: storedToken.sessionId,
			}
			: (() => {
				const membership = refreshedUser.tenantMemberships[0];
				if (!membership) {
					throw forbiddenError(
						'No active tenant membership found for this user',
						'TENANT_MEMBERSHIP_NOT_FOUND',
					);
				}

				if (
					membership.tenant.status !== 'ACTIVE' &&
					membership.tenant.status !== 'TRIAL'
				) {
					throw forbiddenError(
						TENANT_ACCESS_ERROR_MESSAGE,
						'TENANT_SUBSCRIPTION_INACTIVE',
					);
				}

				return {
					userId: refreshedUser.id,
					role: membership.role,
					tenantId: membership.tenantId,
					sessionId: storedToken.sessionId,
				};
			})();

	const tokens = await issueTokensForUser(
		refreshedContext,
		{
			userAgent: context.userAgent ?? storedToken.userAgent ?? undefined,
			ipAddress: context.ipAddress ?? storedToken.ipAddress ?? undefined,
		},
		storedToken.sessionId,
	);

	await prisma.authRefreshToken.update({
		where: { id: storedToken.id },
		data: {
			revokedAt: new Date(),
			revokedReason: 'rotated',
			replacedByTokenId: tokens.refreshTokenId,
		},
	});

	return {
		token: tokens.accessToken,
		user: toPublicUser(refreshedUser),
		tokens,
	};
};

export const logout = async (refreshToken?: string): Promise<void> => {
	if (!refreshToken) {
		return;
	}

	await prisma.authRefreshToken.updateMany({
		where: {
			tokenHash: hashToken(refreshToken),
			revokedAt: null,
		},
		data: {
			revokedAt: new Date(),
			revokedReason: 'logout',
		},
	});
};

export const getMe = async (userId: string): Promise<PublicUser> => {
	const user = await getActiveUserById(userId);
	return toPublicUser(user);
};

export const changePassword = async (
	userId: string,
	input: ChangePasswordInput,
): Promise<void> => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: USER_WITH_PASSWORD_SELECT,
	});

	if (!user) {
		throw unauthorizedError('User account was not found', 'USER_NOT_FOUND');
	}

	if (!user.isActive) {
		throw forbiddenError('User account is inactive', 'USER_INACTIVE');
	}

	const passwordMatches = await comparePassword(
		input.currentPassword,
		user.passwordHash,
	);

	if (!passwordMatches) {
		throw unauthorizedError('Current password is incorrect', 'INVALID_CREDENTIALS');
	}

	const isSamePassword = await comparePassword(
		input.newPassword,
		user.passwordHash,
	);
	if (isSamePassword) {
		throw validationError(
			'New password must be different from the current password',
		);
	}

	const newPasswordHash = await hashPassword(input.newPassword);

	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: {
				passwordHash: newPasswordHash,
			},
		}),
		prisma.authRefreshToken.updateMany({
			where: {
				userId,
				revokedAt: null,
			},
			data: {
				revokedAt: new Date(),
				revokedReason: 'password_changed',
			},
		}),
	]);
};

export const revokeAllSessionsForUser = revokeUserRefreshTokens;
