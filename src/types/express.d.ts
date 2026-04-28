import { Role } from '@prisma/client';

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				name: string;
				email: string | null;
				phone: string;
				role: Role;
				isActive: boolean;
			};
		}
	}
}

export {};
