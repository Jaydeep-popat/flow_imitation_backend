import { Router } from 'express';
import * as ctrl from './inventory.controller';

const router = Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get inventory stock
 *     description: Returns inventory balances for all designs, including unpackaged pieces and packaged dozens.
 *     tags: [Inventory]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory stock list
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
 *                     $ref: '#/components/schemas/InventoryStock'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllInventory);

/**
 * @swagger
 * /api/inventory/package:
 *   post:
 *     summary: Create a packaging batch
 *     description: Converts unpackaged pieces into packaged dozens and records the packaging event.
 *     tags: [Inventory]
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
 *               - stockId
 *               - dozensPackaged
 *             properties:
 *               stockId:
 *                 type: string
 *                 format: uuid
 *               dozensPackaged:
 *                 type: integer
 *                 example: 3
 *               piecesUsed:
 *                 type: integer
 *                 example: 36
 *     responses:
 *       201:
 *         description: Packaging batch created
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
 *                     id:
 *                       type: string
 *                     stockId:
 *                       type: string
 *                     dozensPackaged:
 *                       type: integer
 *                     piecesUsed:
 *                       type: integer
 *                     packedAt:
 *                       type: string
 *                       format: date-time
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
router.post('/package', ctrl.createPackagingBatch);

/**
 * @swagger
 * /api/inventory/packaging-history:
 *   get:
 *     summary: Get packaging history
 *     description: Returns historical packaging batches for audit and stock traceability.
 *     tags: [Inventory]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packaging history list
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       stockId:
 *                         type: string
 *                       dozensPackaged:
 *                         type: integer
 *                       piecesUsed:
 *                         type: integer
 *                       packedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/packaging-history', ctrl.getPackagingHistory);

/**
 * @swagger
 * /api/inventory/{designId}:
 *   get:
 *     summary: Get inventory by design
 *     description: Returns the current inventory row for the specified design.
 *     tags: [Inventory]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: designId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Design UUID
 *     responses:
 *       200:
 *         description: Inventory record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryStock'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Inventory row not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:designId', ctrl.getInventoryByDesign);

/**
 * @swagger
 * /api/inventory/{designId}/alert:
 *   patch:
 *     summary: Set low stock alert
 *     description: Updates the alert threshold at which low stock should be flagged for a design.
 *     tags: [Inventory]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: designId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Design UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lowStockAlertAt
 *             properties:
 *               lowStockAlertAt:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Alert threshold updated
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
 *                       example: Low stock alert updated
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
 *         description: Inventory row not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:designId/alert', ctrl.setLowStockAlert);

export default router;

