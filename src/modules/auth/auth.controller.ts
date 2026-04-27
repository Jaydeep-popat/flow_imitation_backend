import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return demo JWT payload.
 * @access  PUBLIC
 */
export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			token: 'demo.jwt.token',
			user: {
				id: 'uuid-1',
				name: 'Demo Owner',
				email: 'owner@ayanshi.com',
				role: 'OWNER',
			},
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout current user session.
 * @access  OWNER, MANAGER, VIEWER
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, { message: 'Logged out successfully' });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			id: 'uuid-1',
			name: 'Demo Owner',
			email: 'owner@ayanshi.com',
			role: 'OWNER',
			isActive: true,
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password for currently logged-in user.
 * @access  OWNER, MANAGER, VIEWER
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, { message: 'Password updated successfully' });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
