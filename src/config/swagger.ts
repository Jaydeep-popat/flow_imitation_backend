import { PlanType, Role, TenantStatus } from '@prisma/client';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Ayanshi Imitation BMS API',
			version: '1.0.0',
			description:
				'Backend API documentation for Ayanshi Imitation Business Management System. Built by Flowoid Technologies.',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local Development Server',
			},
			{
				url: 'http://140.245.193.49:3000',
				description: 'Oracle VPS Production Server',
			},
		],
		components: {
			securitySchemes: {
				accessTokenCookie: {
					type: 'apiKey',
					in: 'cookie',
					name: 'accessToken',
					description:
						'Primary authentication method for browser clients. This HTTP-only cookie is issued by POST /api/auth/login and rotated through POST /api/auth/refresh.',
				},
				refreshTokenCookie: {
					type: 'apiKey',
					in: 'cookie',
					name: 'refreshToken',
					description:
						'Refresh-session cookie used only by POST /api/auth/refresh. It is HTTP-only, long-lived, and rotated on every refresh.',
				},
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description:
						'Optional fallback for non-browser clients. The backend also accepts Authorization: Bearer <access-token> for access-token protected routes.',
				},
			},
			schemas: {
				SuccessResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: true },
						data: { type: 'object' },
					},
				},
				ErrorResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: false },
						error: {
							type: 'object',
							properties: {
								code: {
									type: 'string',
									example: 'INVALID_ACCESS_TOKEN',
								},
								message: {
									type: 'string',
									example: 'Access token is invalid',
								},
								details: {
									type: 'object',
									nullable: true,
									additionalProperties: true,
								},
							},
							required: ['code', 'message'],
						},
					},
					required: ['success', 'error'],
				},
				AuthTiming: {
					type: 'object',
					properties: {
						accessTokenExpiresAt: {
							type: 'string',
							format: 'date-time',
						},
						refreshTokenExpiresAt: {
							type: 'string',
							format: 'date-time',
						},
					},
					required: ['accessTokenExpiresAt', 'refreshTokenExpiresAt'],
				},
				AuthSessionResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: true },
						data: {
							type: 'object',
							properties: {
								token: {
									type: 'string',
									example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
								},
								user: {
									$ref: '#/components/schemas/User',
								},
							},
							required: ['token', 'user'],
						},
					},
					required: ['success', 'data'],
				},
				UserResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: true },
						data: {
							$ref: '#/components/schemas/User',
						},
					},
					required: ['success', 'data'],
				},
				MessageResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: true },
						data: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									example: 'Operation completed successfully',
								},
							},
							required: ['message'],
						},
					},
					required: ['success', 'data'],
				},
				User: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string', example: 'Ravi Shah' },
						email: { type: 'string', example: 'ravi@flowoid.com' },
						phone: { type: 'string', example: '9876543210' },
						role: { type: 'string', enum: Object.values(Role) },
						tenant: {
							oneOf: [
								{ $ref: '#/components/schemas/Tenant' },
								{ type: 'null' },
							],
						},
					},
				},
				Tenant: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string', example: 'Ayanshi Imitation' },
						slug: { type: 'string', example: 'ayanshi-imitation' },
						plan: { type: 'string', enum: Object.values(PlanType) },
						status: { type: 'string', enum: Object.values(TenantStatus) },
						trialEndsAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
						subscriptionEndsAt: {
							type: 'string',
							format: 'date-time',
							nullable: true,
						},
					},
				},
				Worker: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string', example: 'Ramesh Patel' },
						phone: { type: 'string', example: '9898989898' },
						address: { type: 'string', example: 'Gota, Ahmedabad' },
						idProofType: { type: 'string', example: 'Aadhar' },
						idProofNumber: { type: 'string', example: 'XXXX-XXXX-1234' },
						isActive: { type: 'boolean', example: true },
					},
				},
				Design: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						designCode: { type: 'string', example: 'AY-NK-001' },
						name: { type: 'string', example: 'Classic Stone Necklace' },
						material: { type: 'string', example: 'Gold Plated' },
						finish: { type: 'string', example: 'Glossy' },
						diamondCount: { type: 'integer', example: 12 },
						pieceRateRs: { type: 'string', example: '18.00' },
						salePricePerDozen: { type: 'string', example: '960.00' },
						isActive: { type: 'boolean', example: true },
					},
				},
				Party: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						partyType: { type: 'string', enum: ['DEALER', 'SUPPLIER'] },
						name: { type: 'string', example: 'Mehta Jewels' },
						phone: { type: 'string', example: '9712345678' },
						city: { type: 'string', example: 'Surat' },
						gstNumber: { type: 'string', example: '24ABCDE1234F1Z5' },
						creditLimit: { type: 'string', example: '50000.00' },
						creditDays: { type: 'integer', example: 30 },
						isActive: { type: 'boolean', example: true },
					},
				},
				Order: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						orderNumber: { type: 'string', example: 'ORD-2025-0001' },
						status: {
							type: 'string',
							enum: ['DRAFT', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'CANCELLED'],
						},
						totalAmount: { type: 'string', example: '4800.00' },
						isCreditOrder: { type: 'boolean', example: true },
						dueDate: { type: 'string', format: 'date-time' },
						dispatchedAt: { type: 'string', format: 'date-time' },
					},
				},
				Payment: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						paymentType: {
							type: 'string',
							enum: [
								'DEALER_PAYMENT',
								'SUPPLIER_PAYMENT',
								'WORKER_PAYMENT',
								'DEALER_ADVANCE',
								'WORKER_ADVANCE',
							],
						},
						paymentMode: { type: 'string', enum: ['CASH', 'BANK_TRANSFER', 'UPI'] },
						amount: { type: 'string', example: '4800.00' },
						isAdvance: { type: 'boolean', example: false },
						paidAt: { type: 'string', format: 'date-time' },
					},
				},
				Assignment: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						workerId: { type: 'string', format: 'uuid' },
						designId: { type: 'string', format: 'uuid' },
						rawMaterialQty: { type: 'number', example: 10 },
						expectedPieces: { type: 'integer', example: 120 },
						returnedPieces: { type: 'integer', example: 48 },
						rejectedPieces: { type: 'integer', example: 2 },
						pieceRateAtAssignment: { type: 'string', example: '18.00' },
						status: {
							type: 'string',
							enum: [
								'ISSUED',
								'IN_PROGRESS',
								'PARTIALLY_RETURNED',
								'COMPLETED',
								'CLOSED',
							],
						},
						issuedAt: { type: 'string', format: 'date-time' },
					},
				},
				InventoryStock: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						designId: { type: 'string', format: 'uuid' },
						unpackagedPieces: { type: 'integer', example: 84 },
						packagedDozens: { type: 'integer', example: 15 },
						lowStockAlertAt: { type: 'integer', example: 5 },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
			},
		},
		security: [{ accessTokenCookie: [] }, { bearerAuth: [] }],
	},
	apis: ['./src/modules/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
