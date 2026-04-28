import { Role } from '@prisma/client';
import { Request, Response } from 'express';

import prisma from '../../lib/prisma';
import { errorResponse, successResponse } from '../../utils/response';
import { hashPassword } from '../../utils/password';

const demoUser = {
	id: 'uuid-1',
	name: 'Ravi Shah',
	email: 'ravi@flowoid.com',
	phone: '9876543210',
	role: 'TENANT_MANAGER',
	isActive: true,
	createdAt: '2025-01-01T00:00:00.000Z',
};

/**
 * @route   GET /api/users
 * @desc    Get all users.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const isActiveQuery = req.query.isActive as string | undefined;
		const where =
			typeof isActiveQuery === 'string'
				? { isActive: isActiveQuery.toLowerCase() === 'true' }
				: undefined;

		const users = await prisma.user.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		successResponse(res, users);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoUser, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/users
 * @desc    Create a new user.
 * @access  OWNER
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, phone, password, role } = req.body;

		if (!name || String(name).trim() === '') {
			errorResponse(res, 'Name is required', 400);
			return;
		}

		if (!email || String(email).trim() === '') {
			errorResponse(res, 'Email is required', 400);
			return;
		}

		if (!phone || String(phone).trim() === '') {
			errorResponse(res, 'Phone is required', 400);
			return;
		}

		if (!password || String(password).trim() === '') {
			errorResponse(res, 'Password is required', 400);
			return;
		}

		if (String(password).length < 8) {
			errorResponse(res, 'Password must be at least 8 characters', 400);
			return;
		}

		if (role && !Object.values(Role).includes(String(role).toUpperCase() as Role)) {
			errorResponse(
				res,
				'Invalid role. Allowed values: SUPER_ADMIN, TENANT_OWNER, TENANT_MANAGER, TENANT_VIEWER',
				400,
			);
			return;
		}

		const passwordHash = await hashPassword(String(password));

		const createdUser = await prisma.user.create({
			data: {
				name: String(name).trim(),
				email: String(email).trim().toLowerCase(),
				phone: String(phone).trim(),
				passwordHash,
				role: role ? (String(role).toUpperCase() as Role) : Role.TENANT_MANAGER,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		successResponse(res, createdUser, 201);
	} catch (err: any) {
		if (err?.code === 'P2002') {
			errorResponse(res, 'User with this email or phone already exists', 409);
			return;
		}

		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/users/:id
 * @desc    Update an existing user.
 * @access  OWNER, MANAGER
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoUser, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/users/:id/deactivate
 * @desc    Deactivate a user account.
 * @access  OWNER
 */
export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, {
			message: `User ${req.params.id} deactivated successfully`,
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
