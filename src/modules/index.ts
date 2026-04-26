import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/users.routes';
import rawMaterialRoutes from './rawMaterials/rawMaterial.routes';
import supplementaryRoutes from './supplementaries/supplementary.routes';
import designRoutes from './designs/designs.routes';
import workerRoutes from './workers/workers.routes';
import assignmentRoutes from './assignments/assignments.routes';
import inventoryRoutes from './inventories/inventory.routes';
import partyRoutes from './parties/parties.routes';
import orderRoutes from './orders/orders.routes';
import paymentRoutes from './payments/payments.routes';
import reportRoutes from './reports/reports.routes';

const router = Router();

// Mount all module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/raw-materials', rawMaterialRoutes);
router.use('/supplementary', supplementaryRoutes);
router.use('/designs', designRoutes);
router.use('/workers', workerRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/parties', partyRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);

export default router;