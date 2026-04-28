import { Role } from '@prisma/client';
import { Request } from 'express';

export interface JwtPayload {
	userId: string;
	role: Role;
	tenantId: string | null;
	sessionId: string;
}

export type AuthenticatedRequest = Request & {
	user: NonNullable<Request['user']> & JwtPayload;
};
