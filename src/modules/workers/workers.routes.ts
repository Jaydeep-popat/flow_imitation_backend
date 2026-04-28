import { Router } from 'express';
import * as ctrl from './workers.controller';

const router = Router();

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get all workers
 *     description: Returns list of all artisan workers registered in the system.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllWorkers);

/**
 * @swagger
 * /api/workers/{id}/summary:
 *   get:
 *     summary: Get worker financial summary
 *     description: Returns total earnings, total paid, outstanding balance, and productivity stats for a worker.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Worker UUID
 *     responses:
 *       200:
 *         description: Worker summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     worker:
 *                       $ref: '#/components/schemas/Worker'
 *                     totalEarnings:
 *                       type: string
 *                       example: '4500.00'
 *                     totalPaid:
 *                       type: string
 *                       example: '3000.00'
 *                     outstandingBalance:
 *                       type: string
 *                       example: '1500.00'
 *                     activeAssignments:
 *                       type: integer
 *                       example: 2
 *                     totalPiecesDelivered:
 *                       type: integer
 *                       example: 250
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Worker not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/summary', ctrl.getWorkerSummary);

/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     description: Returns a single worker with profile details for the supplied UUID.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Worker UUID
 *     responses:
 *       200:
 *         description: Worker details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Worker not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getWorkerById);

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Create a worker
 *     description: Registers a new artisan worker with contact and identity proof details.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh Patel
 *               phone:
 *                 type: string
 *                 example: '9898989898'
 *               address:
 *                 type: string
 *                 example: Gota, Ahmedabad
 *               idProofType:
 *                 type: string
 *                 example: Aadhar
 *               idProofNumber:
 *                 type: string
 *                 example: XXXX-XXXX-1234
 *     responses:
 *       201:
 *         description: Worker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', ctrl.createWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   patch:
 *     summary: Update worker details
 *     description: Updates contact information or identity proof details for an existing worker.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Worker UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               idProofType:
 *                 type: string
 *               idProofNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Worker not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', ctrl.updateWorker);

/**
 * @swagger
 * /api/workers/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a worker
 *     description: Marks a worker profile as inactive without removing historical records.
 *     tags: [Workers]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Worker UUID
 *     responses:
 *       200:
 *         description: Worker deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Worker deactivated successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Worker not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/deactivate', ctrl.deactivateWorker);

export default router;

