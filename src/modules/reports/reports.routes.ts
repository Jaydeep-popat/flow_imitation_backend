import { Router } from 'express';
import * as ctrl from './reports.controller';

const router = Router();

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     description: Returns summarized sales totals grouped by day.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report
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
 *                       orders:
 *                         type: integer
 *                       revenue:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/sales', ctrl.getSalesReport);

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Get stock report
 *     description: Returns a combined report of finished goods stock by design.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock report
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
 *                       designCode:
 *                         type: string
 *                       packagedDozens:
 *                         type: integer
 *                       unpackagedPieces:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stock', ctrl.getStockReport);

/**
 * @swagger
 * /api/reports/workers:
 *   get:
 *     summary: Get worker report
 *     description: Returns worker productivity and earnings metrics for reporting dashboards.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Worker performance report
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
 *                       workerId:
 *                         type: string
 *                       workerName:
 *                         type: string
 *                       acceptedPieces:
 *                         type: integer
 *                       earnings:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/workers', ctrl.getWorkerReport);

/**
 * @swagger
 * /api/reports/purchases:
 *   get:
 *     summary: Get purchase report
 *     description: Returns summarized raw material purchase entries for reporting.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase report
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
 *                       purchaseId:
 *                         type: string
 *                       materialType:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       totalCost:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/purchases', ctrl.getPurchaseReport);

/**
 * @swagger
 * /api/reports/profit-overview:
 *   get:
 *     summary: Get profit overview
 *     description: Returns top-level margin and profitability metrics for the business.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profit overview
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
 *                     grossSales:
 *                       type: string
 *                     materialCost:
 *                       type: string
 *                     laborCost:
 *                       type: string
 *                     netProfit:
 *                       type: string
 *                     marginPercent:
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
router.get('/profit-overview', ctrl.getProfitOverview);

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     description: Returns a mixed dashboard payload containing alerts, top metrics, and operational highlights.
 *     tags: [Reports]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary payload
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
 *                     todaySales:
 *                       type: object
 *                     lowStockDesigns:
 *                       type: array
 *                       items:
 *                         type: object
 *                     topOverdueParties:
 *                       type: array
 *                       items:
 *                         type: object
 *                     activeWorkerAssignments:
 *                       type: integer
 *                     rawMaterialAlerts:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', ctrl.getDashboardSummary);

export default router;

