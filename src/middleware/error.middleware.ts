import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError, isAppError } from '../common/errors/app-error';

// Global error handler middleware
export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof ZodError) {
		res.status(400).json({
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: 'Request validation failed',
				details: err.flatten(),
			},
		});
		return;
	}

	if (isAppError(err)) {
		res.status(err.statusCode).json({
			success: false,
			error: {
				code: err.code,
				message: err.message,
				details: err.details,
			},
		});
		return;
	}

	const message =
		err instanceof Error ? err.message : 'Internal server error';

	res.status(500).json({
		success: false,
		error: {
			code: 'INTERNAL_SERVER_ERROR',
			message,
		},
	});
};
