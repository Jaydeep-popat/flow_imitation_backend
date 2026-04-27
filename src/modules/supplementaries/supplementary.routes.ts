import { Router } from 'express';
import * as ctrl from './supplementary.controller';

const router = Router();

/**
 * @swagger
 * /api/supplementary:
 *   get:
 *     summary: Get supplementary material types
 *     description: Returns the catalog of supplementary materials such as stones, fittings, and consumables.
 *     tags: [Supplementary Materials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supplementary materials
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
 *                       name:
 *                         type: string
 *                       unit:
 *                         type: string
 *                       stockQuantity:
 *                         type: number
 *                       isActive:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllSupplementaryTypes);

/**
 * @swagger
 * /api/supplementary:
 *   post:
 *     summary: Create a supplementary material type
 *     description: Adds a new supplementary material definition for stock tracking and issuance.
 *     tags: [Supplementary Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: White Round Stones
 *               unit:
 *                 type: string
 *                 example: pieces
 *               stockQuantity:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Supplementary material created
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
 *                     name:
 *                       type: string
 *                     unit:
 *                       type: string
 *                     stockQuantity:
 *                       type: number
 *                     isActive:
 *                       type: boolean
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
router.post('/', ctrl.createSupplementaryType);

/**
 * @swagger
 * /api/supplementary/{id}:
 *   patch:
 *     summary: Update a supplementary material
 *     description: Updates the properties of a supplementary material master record.
 *     tags: [Supplementary Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Supplementary material UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Supplementary material updated
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
 *                     name:
 *                       type: string
 *                     unit:
 *                       type: string
 *                     stockQuantity:
 *                       type: number
 *                     isActive:
 *                       type: boolean
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
 *         description: Supplementary material not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', ctrl.updateSupplementaryType);

/**
 * @swagger
 * /api/supplementary/{id}/stock:
 *   patch:
 *     summary: Adjust supplementary stock
 *     description: Applies a manual stock adjustment to a supplementary material entry.
 *     tags: [Supplementary Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Supplementary material UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 250
 *               reason:
 *                 type: string
 *                 example: Manual stock correction
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
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
 *                       example: Stock adjusted successfully
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
 *         description: Supplementary material not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/stock', ctrl.adjustStock);

/**
 * @swagger
 * /api/supplementary/issuances:
 *   get:
 *     summary: Get supplementary material issuances
 *     description: Returns all supplementary material issues recorded against worker assignments.
 *     tags: [Supplementary Materials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of issuances
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
 *                       assignmentId:
 *                         type: string
 *                       materialId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       issuedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/issuances', ctrl.getAllIssuances);

export default router;
