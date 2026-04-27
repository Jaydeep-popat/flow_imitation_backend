import { Router } from 'express';
import * as ctrl from './payments.controller';

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     description: Returns dealer, supplier, and worker payment transactions recorded in the system.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment list
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
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllPayments);

/**
 * @swagger
 * /api/payments/outstanding:
 *   get:
 *     summary: Get outstanding report
 *     description: Returns the overall outstanding balance and dealer-wise aging breakdown.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Outstanding report
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
 *                     totalOutstanding:
 *                       type: string
 *                     dealers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dealerId:
 *                             type: string
 *                           dealerName:
 *                             type: string
 *                           outstanding:
 *                             type: string
 *                           oldestDue:
 *                             type: string
 *                             format: date-time
 *                           agingBucket:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/outstanding', ctrl.getOutstandingReport);

/**
 * @swagger
 * /api/payments/cashflow:
 *   get:
 *     summary: Get daily cashflow
 *     description: Returns a daily inflow, outflow, and net cashflow summary.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cashflow summary
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
 *                       date:
 *                         type: string
 *                       inflow:
 *                         type: string
 *                       outflow:
 *                         type: string
 *                       net:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/cashflow', ctrl.getDailyCashflow);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     description: Returns the details of a single payment transaction.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Payment UUID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getPaymentById);

/**
 * @swagger
 * /api/payments/dealer:
 *   post:
 *     summary: Record dealer payment
 *     description: Records a payment or advance received from a dealer against an order or account balance.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partyId
 *               - amount
 *             properties:
 *               partyId:
 *                 type: string
 *                 format: uuid
 *               orderId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: string
 *                 example: '4800.00'
 *               paymentMode:
 *                 type: string
 *                 enum: [CASH, BANK_TRANSFER, UPI]
 *               isAdvance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Dealer payment recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
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
router.post('/dealer', ctrl.recordDealerPayment);

/**
 * @swagger
 * /api/payments/supplier:
 *   post:
 *     summary: Record supplier payment
 *     description: Records a payment made to a supplier for material purchases or outstanding balances.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partyId
 *               - amount
 *             properties:
 *               partyId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: string
 *                 example: '2500.00'
 *               paymentMode:
 *                 type: string
 *                 enum: [CASH, BANK_TRANSFER, UPI]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier payment recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
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
router.post('/supplier', ctrl.recordSupplierPayment);

/**
 * @swagger
 * /api/payments/worker:
 *   post:
 *     summary: Record worker payment
 *     description: Records a wage or advance payment made to a worker.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workerId
 *               - amount
 *             properties:
 *               workerId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: string
 *                 example: '3000.00'
 *               paymentMode:
 *                 type: string
 *                 enum: [CASH, BANK_TRANSFER, UPI]
 *               isAdvance:
 *                 type: boolean
 *                 example: false
 *               notes:
 *                 type: string
 *                 example: Weekly worker payout
 *     responses:
 *       201:
 *         description: Worker payment recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
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
router.post('/worker', ctrl.recordWorkerPayment);

export default router;
