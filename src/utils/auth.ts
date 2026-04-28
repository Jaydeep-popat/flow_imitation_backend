import { Role } from '@prisma/client';
import crypto from 'crypto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import {
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_TTL_SECONDS,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_TTL_SECONDS,
} from '../config/auth';
import { AppError } from '../common/errors/app-error';

type BaseUserPayload = {
	sub: string;
	role: Role;
};

export type AccessTokenPayload = BaseUserPayload & {
	typ: 'access';
};

export type RefreshTokenPayload = BaseUserPayload & {
	typ: 'refresh';
	sessionId: string;
	jti: string;
};

type SignableUser = {
	id: string;
	role: Role;
};

type RefreshTokenInput = SignableUser & {
	sessionId: string;
	tokenId: string;
};

const mapJwtError = (error: unknown, expiredCode: string, invalidCode: string): never => {
	if (error instanceof TokenExpiredError) {
		throw new AppError(401, 'Token has expired', expiredCode);
	}

	if (error instanceof JsonWebTokenError) {
		throw new AppError(401, 'Token is invalid', invalidCode);
	}

	throw error;
};

export const generateAccessToken = (user: SignableUser): string =>
	jwt.sign(
		{
			sub: user.id,
			role: user.role,
			typ: 'access',
		},
		ACCESS_TOKEN_SECRET,
		{
			expiresIn: ACCESS_TOKEN_TTL_SECONDS,
		},
	);

export const generateRefreshToken = (input: RefreshTokenInput): string =>
	jwt.sign(
		{
			sub: input.id,
			role: input.role,
			sessionId: input.sessionId,
			jti: input.tokenId,
			typ: 'refresh',
		},
		REFRESH_TOKEN_SECRET,
		{
			expiresIn: REFRESH_TOKEN_TTL_SECONDS,
		},
	);

export const verifyAccessToken = (token: string): AccessTokenPayload => {
	try {
		return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
	} catch (error) {
		return mapJwtError(error, 'ACCESS_TOKEN_EXPIRED', 'INVALID_ACCESS_TOKEN');
	}
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
	try {
		return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
	} catch (error) {
		return mapJwtError(error, 'REFRESH_TOKEN_EXPIRED', 'INVALID_REFRESH_TOKEN');
	}
};

export const hashToken = (token: string): string =>
	crypto.createHash('sha256').update(token).digest('hex');

export const areTokenHashesEqual = (
	expectedHash: string,
	providedHash: string,
): boolean => {
	const expectedBuffer = Buffer.from(expectedHash, 'hex');
	const providedBuffer = Buffer.from(providedHash, 'hex');

	if (expectedBuffer.length !== providedBuffer.length) {
		return false;
	}

	return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
};
