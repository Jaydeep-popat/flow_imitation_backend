import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

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
import userRoutes from './modules/users/users.routes';
import workerRoutes from './modules/workers/workers.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/designs',      designRoutes);
app.use('/api/workers',      workerRoutes);
app.use('/api/assignments',  assignmentRoutes);
app.use('/api/inventory',    inventoryRoutes);
app.use('/api/parties',      partyRoutes);
app.use('/api/orders',       orderRoutes);
app.use('/api/payments',     paymentRoutes);
app.use('/api/reports',      reportRoutes);

// Global error handler — always last
app.use(errorHandler);

export default app;