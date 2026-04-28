import { Role } from '@prisma/client';
import { Request } from 'express';

export type AuthenticatedUser = {
	id: string;
	name: string;
	email: string | null;
	phone: string;
	role: Role;
	isActive: boolean;
};

export type AuthenticatedRequest = Request & {
	user?: AuthenticatedUser;
};
