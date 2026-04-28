import { Router } from 'express';
import * as ctrl from './rawMaterial.controller';

const router = Router();

/**
 * @swagger
 * /api/raw-materials/types:
 *   get:
 *     summary: Get raw material types
 *     description: Returns all configured raw material master records with unit and status information.
 *     tags: [Raw Materials]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of raw material types
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
 *                       isActive:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/types', ctrl.getAllMaterialTypes);

/**
 * @swagger
 * /api/raw-materials/types:
 *   post:
 *     summary: Create a raw material type
 *     description: Creates a raw material master entry used for stock purchases and assignments.
 *     tags: [Raw Materials]
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
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gold Plated Metal Base
 *               unit:
 *                 type: string
 *                 example: KG
 *     responses:
 *       201:
 *         description: Raw material type created
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
router.post('/types', ctrl.createMaterialType);

/**
 * @swagger
 * /api/raw-materials/types/{id}:
 *   patch:
 *     summary: Update a raw material type
 *     description: Updates the name, unit, or active status of a raw material type.
 *     tags: [Raw Materials]
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
 *         description: Raw material type UUID
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Raw material type updated
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
 *         description: Raw material type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/types/:id', ctrl.updateMaterialType);

/**
 * @swagger
 * /api/raw-materials/purchases:
 *   get:
 *     summary: Get raw material purchases
 *     description: Returns purchase history records for raw materials bought from suppliers.
 *     tags: [Raw Materials]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase entries
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
 *                       materialTypeId:
 *                         type: string
 *                       supplierId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       costPerUnit:
 *                         type: string
 *                       totalCost:
 *                         type: string
 *                       purchaseDate:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/purchases', ctrl.getAllPurchases);

/**
 * @swagger
 * /api/raw-materials/purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     description: Returns the details of one raw material purchase entry.
 *     tags: [Raw Materials]
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
 *         description: Purchase UUID
 *     responses:
 *       200:
 *         description: Purchase details
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
 *                     materialTypeId:
 *                       type: string
 *                     supplierId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     costPerUnit:
 *                       type: string
 *                     totalCost:
 *                       type: string
 *                     purchaseDate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/purchases/:id', ctrl.getPurchaseById);

/**
 * @swagger
 * /api/raw-materials/purchases:
 *   post:
 *     summary: Create a purchase entry
 *     description: Records a supplier purchase of raw materials and updates stock history.
 *     tags: [Raw Materials]
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
 *               - materialTypeId
 *               - supplierId
 *               - quantity
 *             properties:
 *               materialTypeId:
 *                 type: string
 *                 format: uuid
 *               supplierId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: number
 *                 example: 50
 *               costPerUnit:
 *                 type: string
 *                 example: '120.00'
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Purchase entry created
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
 *                     materialTypeId:
 *                       type: string
 *                     supplierId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     costPerUnit:
 *                       type: string
 *                     totalCost:
 *                       type: string
 *                     purchaseDate:
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
router.post('/purchases', ctrl.createPurchase);

/**
 * @swagger
 * /api/raw-materials/stock:
 *   get:
 *     summary: Get raw material stock
 *     description: Returns the running stock balance for each raw material type.
 *     tags: [Raw Materials]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock summary
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
 *                       materialType:
 *                         type: string
 *                       unit:
 *                         type: string
 *                       totalPurchased:
 *                         type: number
 *                       totalIssued:
 *                         type: number
 *                       currentStock:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stock', ctrl.getRawMaterialStock);

export default router;

