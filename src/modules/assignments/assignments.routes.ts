import { Router } from 'express';
import * as ctrl from './assignments.controller';

const router = Router();

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     description: Returns assignment records that track issued work, expected output, and completion status.
 *     tags: [Assignments]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
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
 *                     $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllAssignments);

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     description: Returns detailed information for a single assignment.
 *     tags: [Assignments]
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
 *         description: Assignment UUID
 *     responses:
 *       200:
 *         description: Assignment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getAssignmentById);

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create an assignment
 *     description: Issues a new production assignment to a worker for a selected design and material quantity.
 *     tags: [Assignments]
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
 *               - workerId
 *               - designId
 *               - rawMaterialQty
 *             properties:
 *               workerId:
 *                 type: string
 *                 format: uuid
 *               designId:
 *                 type: string
 *                 format: uuid
 *               rawMaterialQty:
 *                 type: number
 *                 example: 10
 *               expectedPieces:
 *                 type: integer
 *                 example: 120
 *               pieceRateAtAssignment:
 *                 type: string
 *                 example: '18.00'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Assignment'
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
router.post('/', ctrl.createAssignment);

/**
 * @swagger
 * /api/assignments/{id}/status:
 *   patch:
 *     summary: Update assignment status
 *     description: Moves an assignment through its workflow such as `ISSUED`, `IN_PROGRESS`, or `COMPLETED`.
 *     tags: [Assignments]
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
 *         description: Assignment UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ISSUED, IN_PROGRESS, PARTIALLY_RETURNED, COMPLETED, CLOSED]
 *     responses:
 *       200:
 *         description: Assignment status updated
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
 *                       example: Assignment status updated successfully
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
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/status', ctrl.updateAssignmentStatus);

/**
 * @swagger
 * /api/assignments/{id}/close:
 *   patch:
 *     summary: Close an assignment
 *     description: Closes an assignment manually once returns and financial reconciliation are complete.
 *     tags: [Assignments]
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
 *         description: Assignment UUID
 *     responses:
 *       200:
 *         description: Assignment closed successfully
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
 *                       example: Assignment closed successfully
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
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/close', ctrl.closeAssignment);

/**
 * @swagger
 * /api/assignments/{id}/returns:
 *   post:
 *     summary: Record a goods return
 *     description: Records finished or rejected pieces returned against an assignment.
 *     tags: [Assignments]
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
 *         description: Assignment UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - piecesReturned
 *             properties:
 *               piecesReturned:
 *                 type: integer
 *                 example: 48
 *               rejectedPieces:
 *                 type: integer
 *                 example: 2
 *               returnedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Goods return recorded successfully
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
 *                     assignmentId:
 *                       type: string
 *                     piecesReturned:
 *                       type: integer
 *                     rejectedPieces:
 *                       type: integer
 *                     acceptedPieces:
 *                       type: integer
 *                     earningAmount:
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
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/returns', ctrl.recordGoodsReturn);

/**
 * @swagger
 * /api/assignments/{id}/returns:
 *   get:
 *     summary: Get assignment returns
 *     description: Returns all goods return entries recorded against the specified assignment.
 *     tags: [Assignments]
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
 *         description: Assignment UUID
 *     responses:
 *       200:
 *         description: Goods return entries
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
 *                       piecesReturned:
 *                         type: integer
 *                       rejectedPieces:
 *                         type: integer
 *                       acceptedPieces:
 *                         type: integer
 *                       earningAmount:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/returns', ctrl.getAssignmentReturns);

export default router;

