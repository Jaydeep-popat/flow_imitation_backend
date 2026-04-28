import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger';
import { requireAuth } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import assignmentRoutes from './modules/assignments/assignments.routes';
import authRoutes from './modules/auth/auth.routes';
import designRoutes from './modules/designs/designs.routes';
import inventoryRoutes from './modules/inventories/inventory.routes';
import orderRoutes from './modules/orders/orders.routes';
import partyRoutes from './modules/parties/parties.routes';
import paymentRoutes from './modules/payments/payments.routes';
import rawMaterialRoutes from './modules/rawMaterials/rawMaterial.routes';
import reportRoutes from './modules/reports/reports.routes';
import supplementaryRoutes from './modules/supplementaries/supplementary.routes';
import userRoutes from './modules/users/users.routes';
import workerRoutes from './modules/workers/workers.routes';

const app = express();

// Swagger UI - registered before helmet() so CSP headers don't block its JS bundles
app.use(
	'/api/docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customSiteTitle: 'Ayanshi BMS API Docs',
		customCss: '.swagger-ui .topbar { background-color: #0F3460; }',
		swaggerOptions: {
			persistAuthorization: true,
		},
	}),
);

// Middleware
app.use(helmet());
app.use(
	cors({
		origin: (origin, callback) => {
			callback(null, origin ?? true);
		},
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/raw-materials', requireAuth, rawMaterialRoutes);
app.use('/api/supplementary', requireAuth, supplementaryRoutes);
app.use('/api/designs', requireAuth, designRoutes);
app.use('/api/workers', requireAuth, workerRoutes);
app.use('/api/assignments', requireAuth, assignmentRoutes);
app.use('/api/inventory', requireAuth, inventoryRoutes);
app.use('/api/parties', requireAuth, partyRoutes);
app.use('/api/orders', requireAuth, orderRoutes);
app.use('/api/payments', requireAuth, paymentRoutes);
app.use('/api/reports', requireAuth, reportRoutes);

// Global error handler - always last
app.use(errorHandler);

export default app;
