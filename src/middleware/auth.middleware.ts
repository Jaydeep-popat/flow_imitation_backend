import { TenantStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import {
	AppError,
	forbiddenError,
	unauthorizedError,
} from '../common/errors/app-error';
import { ACCESS_TOKEN_SECRET } from '../config/auth';
import prisma from '../lib/prisma';
import { getAccessTokenFromRequest } from '../modules/auth/auth.cookies';
import { AuthenticatedRequest, JwtPayload } from '../types/auth.types';
import { errorResponse } from '../utils/response';

const TENANT_ACCESS_ERROR_MESSAGE =
	'Your subscription has been suspended. Please contact Flowoid Technologies.';

const verifyAccessToken = (token: string): JwtPayload => {
	try {
		return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw new AppError(401, 'Token has expired', 'ACCESS_TOKEN_EXPIRED');
		}

		if (error instanceof JsonWebTokenError) {
			throw new AppError(401, 'Token is invalid', 'INVALID_ACCESS_TOKEN');
		}

		throw error;
	}
};

export const requireAuth = async (
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authReq = req as AuthenticatedRequest;
		const token = getAccessTokenFromRequest(req);
		if (!token) {
			throw unauthorizedError('Access token is missing', 'MISSING_ACCESS_TOKEN');
		}

		const payload = verifyAccessToken(token);
		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
			select: {
				role: true,
				isActive: true,
			},
		});

		if (!user) {
			throw unauthorizedError('User account was not found', 'USER_NOT_FOUND');
		}

		if (!user.isActive) {
			throw forbiddenError('User account is inactive', 'USER_INACTIVE');
		}

		authReq.user = {
			...(authReq.user ?? {}),
			...payload,
		};
		next();
	} catch (error) {
		next(error);
	}
};

export const requireActiveTenant = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authReq = req as AuthenticatedRequest;
		if (authReq.user.role === 'SUPER_ADMIN') {
			next();
			return;
		}

		if (!authReq.user.tenantId) {
			errorResponse(
				res,
				'Forbidden. Tenant context is required for this user.',
				403,
			);
			return;
		}

		const tenant = await prisma.tenant.findUnique({
			where: { id: authReq.user.tenantId },
			select: {
				status: true,
			},
		});

		if (!tenant) {
			errorResponse(
				res,
				'Forbidden. Tenant context is invalid for this user.',
				403,
			);
			return;
		}

		if (
			tenant.status !== TenantStatus.ACTIVE &&
			tenant.status !== TenantStatus.TRIAL
		) {
			errorResponse(res, TENANT_ACCESS_ERROR_MESSAGE, 403);
			return;
		}

		next();
	} catch (error) {
		next(error);
	}
};
