import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import {
	unauthorizedError,
	validationError,
} from '../../common/errors/app-error';
import { AuthenticatedRequest } from '../../types/auth.types';
import { successResponse } from '../../utils/response';
import { clearAuthCookies, getRefreshTokenFromRequest, setAuthCookies } from './auth.cookies';
import * as authService from './auth.service';

const loginSchema = z.object({
	phone: z.string().trim().min(6, 'Phone must be at least 6 digits long'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const changePasswordSchema = z.object({
	currentPassword: z
		.string()
		.min(8, 'Current password must be at least 8 characters long'),
	newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

const getRequestContext = (req: Request) => ({
	userAgent: req.get('user-agent'),
	ipAddress: req.ip || req.socket.remoteAddress || undefined,
});

const parseOrThrow = <T>(schema: z.ZodSchema<T>, value: unknown): T => {
	const result = schema.safeParse(value);
	if (!result.success) {
		throw validationError('Request validation failed', result.error.flatten());
	}

	return result.data;
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and issue access and refresh token cookies.
 * @access  PUBLIC
 */
export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const input = parseOrThrow(loginSchema, req.body);
		const result = await authService.login(input, getRequestContext(req));

		setAuthCookies(res, result.tokens);
		successResponse(
			res,
			{
				token: result.token,
				user: result.user,
			},
			200,
		);
	} catch (error) {
		next(error);
	}
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Rotate refresh token and issue fresh auth cookies.
 * @access  PUBLIC
 */
export const refresh = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const refreshToken = getRefreshTokenFromRequest(req);
		if (!refreshToken) {
			throw unauthorizedError(
				'Refresh token cookie is missing',
				'MISSING_REFRESH_TOKEN',
			);
		}

		const result = await authService.refreshSession(
			refreshToken,
			getRequestContext(req),
		);

		setAuthCookies(res, result.tokens);
		successResponse(res, {
			token: result.token,
			user: result.user,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout current user session.
 * @access  SUPER_ADMIN, TENANT_OWNER, TENANT_MANAGER, TENANT_VIEWER
 */
export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		await authService.logout(getRefreshTokenFromRequest(req));
		clearAuthCookies(res);
		successResponse(res, { message: 'Logged out successfully' });
	} catch (error) {
		next(error);
	}
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile.
 * @access  SUPER_ADMIN, TENANT_OWNER, TENANT_MANAGER, TENANT_VIEWER
 */
export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authReq = req as AuthenticatedRequest;
		const user = await authService.getMe(authReq.user.userId);
		successResponse(res, user);
	} catch (error) {
		next(error);
	}
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password for currently logged-in user.
 * @access  SUPER_ADMIN, TENANT_OWNER, TENANT_MANAGER, TENANT_VIEWER
 */
export const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authReq = req as AuthenticatedRequest;
		const input = parseOrThrow(changePasswordSchema, req.body);
		await authService.changePassword(authReq.user.userId, input);
		clearAuthCookies(res);
		successResponse(res, {
			message:
				'Password updated successfully. Please log in again on this device.',
		});
	} catch (error) {
		next(error);
	}
};
