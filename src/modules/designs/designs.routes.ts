import { Router } from 'express';
import * as ctrl from './designs.controller';

const router = Router();

/**
 * @swagger
 * /api/designs/categories:
 *   get:
 *     summary: Get all design categories
 *     description: Returns the list of available design categories used to classify design records.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/categories', ctrl.getAllCategories);

/**
 * @swagger
 * /api/designs/categories:
 *   post:
 *     summary: Create a design category
 *     description: Creates a new design category for grouping similar jewellery designs.
 *     tags: [Designs]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Necklace
 *     responses:
 *       201:
 *         description: Category created successfully
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
router.post('/categories', ctrl.createCategory);

/**
 * @swagger
 * /api/designs:
 *   get:
 *     summary: Get all designs
 *     description: Returns the catalog of designs available for assignments, pricing, and sales.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of designs
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
 *                     $ref: '#/components/schemas/Design'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllDesigns);

/**
 * @swagger
 * /api/designs/{id}:
 *   get:
 *     summary: Get design by ID
 *     description: Returns a single design record with material, finish, and rate details.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Design UUID
 *     responses:
 *       200:
 *         description: Design details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Design'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Design not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getDesignById);

/**
 * @swagger
 * /api/designs:
 *   post:
 *     summary: Create a design
 *     description: Adds a new design with product code, material, rates, and sale price information.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - designCode
 *               - name
 *             properties:
 *               designCode:
 *                 type: string
 *                 example: AY-NK-001
 *               name:
 *                 type: string
 *                 example: Classic Stone Necklace
 *               material:
 *                 type: string
 *                 example: Gold Plated
 *               finish:
 *                 type: string
 *                 example: Glossy
 *               diamondCount:
 *                 type: integer
 *                 example: 12
 *               pieceRateRs:
 *                 type: string
 *                 example: '18.00'
 *               salePricePerDozen:
 *                 type: string
 *                 example: '960.00'
 *     responses:
 *       201:
 *         description: Design created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Design'
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
router.post('/', ctrl.createDesign);

/**
 * @swagger
 * /api/designs/{id}:
 *   patch:
 *     summary: Update a design
 *     description: Updates the details of an existing design, including rates and category metadata.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               material:
 *                 type: string
 *               finish:
 *                 type: string
 *               diamondCount:
 *                 type: integer
 *               pieceRateRs:
 *                 type: string
 *               salePricePerDozen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Design updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Design'
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
 *         description: Design not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', ctrl.updateDesign);

/**
 * @swagger
 * /api/designs/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a design
 *     description: Marks a design as inactive so it no longer appears in active business flows.
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Design UUID
 *     responses:
 *       200:
 *         description: Design deactivated successfully
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
 *                       example: Design deactivated successfully
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
 *         description: Design not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/deactivate', ctrl.deactivateDesign);

export default router;
