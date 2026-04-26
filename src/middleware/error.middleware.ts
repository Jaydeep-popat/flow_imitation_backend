import { NextFunction, Request, Response } from 'express';

// Global error handler middleware
export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const statusCode =
		typeof err === 'object' && err !== null && 'statusCode' in err && typeof (err as { statusCode?: unknown }).statusCode === 'number'
			? (err as { statusCode: number }).statusCode
			: 500;

	const message =
		typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
			? (err as { message: string }).message
			: 'Internal server error';

	res.status(statusCode).json({
		success: false,
		message,
	});
};