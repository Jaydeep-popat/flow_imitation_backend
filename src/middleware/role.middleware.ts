import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { AuthenticatedRequest } from '../types/auth.types';
import { errorResponse } from '../utils/response';

export const requireRole =
	(allowedRoles: Role[]) =>
	(req: Request, res: Response, next: NextFunction): void => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			errorResponse(res, 'Unauthorized. Authentication is required.', 401);
			return;
		}

		if (!allowedRoles.includes(authReq.user.role)) {
			errorResponse(res, 'Forbidden. Insufficient role permissions.', 403);
			return;
		}

		next();
	};

export const requireSuperAdmin = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const authReq = req as AuthenticatedRequest;
	if (authReq.user?.role !== 'SUPER_ADMIN') {
		errorResponse(res, 'Forbidden. Super admin access required.', 403);
		return;
	}

	next();
};

export const authorizeRoles = requireRole;
