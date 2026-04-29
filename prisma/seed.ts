import 'dotenv/config';


import { PrismaPg } from '@prisma/adapter-pg';
import { PlanType, PrismaClient, Role, TenantStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set. Please configure it in .env');
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
	adapter,
	log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
});

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD ?? 'Password@123';

const envOrDefault = (value: string | undefined, fallback: string): string =>
	value?.trim() ? value.trim() : fallback;

const hashPassword = async (plainPassword: string): Promise<string> =>
	bcrypt.hash(plainPassword, 10);

const upsertUser = async (input: {
	name: string;
	email?: string;
	phone: string;
	password: string;
	role: Role;
}) => {
	const passwordHash = await hashPassword(input.password);

	return prisma.user.upsert({
		where: { phone: input.phone },
		update: {
			name: input.name,
			email: input.email ?? null,
			passwordHash,
			role: input.role,
			isActive: true,
		},
		create: {
			name: input.name,
			email: input.email ?? null,
			phone: input.phone,
			passwordHash,
			role: input.role,
			isActive: true,
		},
	});
};

async function main() {
	const tenantPlan = (process.env.SEED_TENANT_PLAN as PlanType | undefined) ?? PlanType.BASIC;
	const tenantStatus =
		(process.env.SEED_TENANT_STATUS as TenantStatus | undefined) ??
		TenantStatus.ACTIVE;

	const tenant = await prisma.tenant.upsert({
		where: {
			slug: envOrDefault(process.env.SEED_TENANT_SLUG, 'ayanshi-imitation'),
		},
		update: {
			name: envOrDefault(process.env.SEED_TENANT_NAME, 'Ayanshi Imitation'),
			email: envOrDefault(
				process.env.SEED_TENANT_EMAIL,
				'admin@ayanshiimitation.com',
			),
			phone: envOrDefault(process.env.SEED_TENANT_PHONE, '9876543210'),
			address: process.env.SEED_TENANT_ADDRESS?.trim() || null,
			plan: tenantPlan,
			status: tenantStatus,
			trialEndsAt:
				tenantStatus === TenantStatus.TRIAL
					? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
					: null,
			subscriptionEndsAt:
				tenantStatus === TenantStatus.ACTIVE
					? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
					: null,
			businessCategory: 'Imitation Jewellery',
		},
		create: {
			name: envOrDefault(process.env.SEED_TENANT_NAME, 'Ayanshi Imitation'),
			slug: envOrDefault(process.env.SEED_TENANT_SLUG, 'ayanshi-imitation'),
			email: envOrDefault(
				process.env.SEED_TENANT_EMAIL,
				'admin@ayanshiimitation.com',
			),
			phone: envOrDefault(process.env.SEED_TENANT_PHONE, '9876543210'),
			address: process.env.SEED_TENANT_ADDRESS?.trim() || null,
			plan: tenantPlan,
			status: tenantStatus,
			trialEndsAt:
				tenantStatus === TenantStatus.TRIAL
					? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
					: null,
			subscriptionEndsAt:
				tenantStatus === TenantStatus.ACTIVE
					? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
					: null,
			businessCategory: 'Imitation Jewellery',
		},
	});

	const superAdmin = await upsertUser({
		name: envOrDefault(process.env.SEED_SUPER_ADMIN_NAME, 'Flowoid Super Admin'),
		email: envOrDefault(
			process.env.SEED_SUPER_ADMIN_EMAIL,
			'superadmin@flowoid.com',
		),
		phone: envOrDefault(process.env.SEED_SUPER_ADMIN_PHONE, '9999999991'),
		password: envOrDefault(process.env.SEED_SUPER_ADMIN_PASSWORD, DEFAULT_PASSWORD),
		role: Role.SUPER_ADMIN,
	});

	const tenantOwner = await upsertUser({
		name: envOrDefault(process.env.SEED_TENANT_OWNER_NAME, 'Ayanshi Owner'),
		email: envOrDefault(
			process.env.SEED_TENANT_OWNER_EMAIL,
			'owner@ayanshiimitation.com',
		),
		phone: envOrDefault(process.env.SEED_TENANT_OWNER_PHONE, '9999999992'),
		password: envOrDefault(process.env.SEED_TENANT_OWNER_PASSWORD, DEFAULT_PASSWORD),
		role: Role.TENANT_OWNER,
	});

	const tenantManager = await upsertUser({
		name: envOrDefault(process.env.SEED_TENANT_MANAGER_NAME, 'Ayanshi Manager'),
		email: envOrDefault(
			process.env.SEED_TENANT_MANAGER_EMAIL,
			'manager@ayanshiimitation.com',
		),
		phone: envOrDefault(process.env.SEED_TENANT_MANAGER_PHONE, '9999999993'),
		password: envOrDefault(
			process.env.SEED_TENANT_MANAGER_PASSWORD,
			DEFAULT_PASSWORD,
		),
		role: Role.TENANT_MANAGER,
	});

	const tenantViewer = await upsertUser({
		name: envOrDefault(process.env.SEED_TENANT_VIEWER_NAME, 'Ayanshi Viewer'),
		email: envOrDefault(
			process.env.SEED_TENANT_VIEWER_EMAIL,
			'viewer@ayanshiimitation.com',
		),
		phone: envOrDefault(process.env.SEED_TENANT_VIEWER_PHONE, '9999999994'),
		password: envOrDefault(
			process.env.SEED_TENANT_VIEWER_PASSWORD,
			DEFAULT_PASSWORD,
		),
		role: Role.TENANT_VIEWER,
	});

	await prisma.tenantUser.upsert({
		where: {
			tenantId_userId: {
				tenantId: tenant.id,
				userId: tenantOwner.id,
			},
		},
		update: {
			role: Role.TENANT_OWNER,
			isActive: true,
		},
		create: {
			tenantId: tenant.id,
			userId: tenantOwner.id,
			role: Role.TENANT_OWNER,
			isActive: true,
		},
	});

	await prisma.tenantUser.upsert({
		where: {
			tenantId_userId: {
				tenantId: tenant.id,
				userId: tenantManager.id,
			},
		},
		update: {
			role: Role.TENANT_MANAGER,
			isActive: true,
		},
		create: {
			tenantId: tenant.id,
			userId: tenantManager.id,
			role: Role.TENANT_MANAGER,
			isActive: true,
		},
	});

	await prisma.tenantUser.upsert({
		where: {
			tenantId_userId: {
				tenantId: tenant.id,
				userId: tenantViewer.id,
			},
		},
		update: {
			role: Role.TENANT_VIEWER,
			isActive: true,
		},
		create: {
			tenantId: tenant.id,
			userId: tenantViewer.id,
			role: Role.TENANT_VIEWER,
			isActive: true,
		},
	});

	console.log('Seed completed successfully.');
	console.log(`Tenant: ${tenant.name} (${tenant.slug})`);
	console.log(`SUPER_ADMIN phone: ${superAdmin.phone}`);
	console.log(`TENANT_OWNER phone: ${tenantOwner.phone}`);
	console.log(`TENANT_MANAGER phone: ${tenantManager.phone}`);
	console.log(`TENANT_VIEWER phone: ${tenantViewer.phone}`);
	console.log(`Default password: ${DEFAULT_PASSWORD}`);
}

main()
	.catch((error) => {
		console.error('Seed failed:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
