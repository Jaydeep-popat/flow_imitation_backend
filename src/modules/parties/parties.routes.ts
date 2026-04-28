import { Router } from 'express';
import * as ctrl from './parties.controller';

const router = Router();

/**
 * @swagger
 * /api/parties:
 *   get:
 *     summary: Get all parties
 *     description: Returns all dealers and suppliers maintained in the party master.
 *     tags: [Parties]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parties
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
 *                     $ref: '#/components/schemas/Party'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ctrl.getAllParties);

/**
 * @swagger
 * /api/parties/dealers:
 *   get:
 *     summary: Get all dealers
 *     description: Returns the subset of parties whose type is `DEALER`.
 *     tags: [Parties]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dealer list
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
 *                     $ref: '#/components/schemas/Party'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dealers', ctrl.getAllDealers);

/**
 * @swagger
 * /api/parties/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     description: Returns the subset of parties whose type is `SUPPLIER`.
 *     tags: [Parties]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier list
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
 *                     $ref: '#/components/schemas/Party'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/suppliers', ctrl.getAllSuppliers);

/**
 * @swagger
 * /api/parties/{id}:
 *   get:
 *     summary: Get party by ID
 *     description: Returns a single dealer or supplier record by UUID.
 *     tags: [Parties]
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
 *         description: Party UUID
 *     responses:
 *       200:
 *         description: Party details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Party'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getPartyById);

/**
 * @swagger
 * /api/parties:
 *   post:
 *     summary: Create a party
 *     description: Creates a new dealer or supplier profile with credit and tax details.
 *     tags: [Parties]
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
 *               - partyType
 *               - name
 *             properties:
 *               partyType:
 *                 type: string
 *                 enum: [DEALER, SUPPLIER]
 *               name:
 *                 type: string
 *                 example: Mehta Jewels
 *               phone:
 *                 type: string
 *                 example: '9712345678'
 *               city:
 *                 type: string
 *                 example: Surat
 *               gstNumber:
 *                 type: string
 *                 example: 24ABCDE1234F1Z5
 *               creditLimit:
 *                 type: string
 *                 example: '50000.00'
 *               creditDays:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Party created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Party'
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
router.post('/', ctrl.createParty);

/**
 * @swagger
 * /api/parties/{id}:
 *   patch:
 *     summary: Update a party
 *     description: Updates master details for a dealer or supplier profile.
 *     tags: [Parties]
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
 *         description: Party UUID
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
 *               city:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               creditLimit:
 *                 type: string
 *               creditDays:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Party updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Party'
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
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', ctrl.updateParty);

/**
 * @swagger
 * /api/parties/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a party
 *     description: Marks a dealer or supplier profile as inactive.
 *     tags: [Parties]
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
 *         description: Party UUID
 *     responses:
 *       200:
 *         description: Party deactivated successfully
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
 *                       example: Party deactivated successfully
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
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/deactivate', ctrl.deactivateParty);

/**
 * @swagger
 * /api/parties/{id}/ledger:
 *   get:
 *     summary: Get party ledger
 *     description: Returns debit and credit ledger entries for the supplied party.
 *     tags: [Parties]
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
 *         description: Party UUID
 *     responses:
 *       200:
 *         description: Ledger entries
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
 *                         format: date-time
 *                       type:
 *                         type: string
 *                       reference:
 *                         type: string
 *                       debit:
 *                         type: string
 *                       credit:
 *                         type: string
 *                       balance:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/ledger', ctrl.getPartyLedger);

/**
 * @swagger
 * /api/parties/{id}/outstanding:
 *   get:
 *     summary: Get party outstanding balance
 *     description: Returns outstanding and overdue balances for the supplied party.
 *     tags: [Parties]
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
 *         description: Party UUID
 *     responses:
 *       200:
 *         description: Outstanding balance summary
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
 *                     partyId:
 *                       type: string
 *                     outstandingAmount:
 *                       type: string
 *                     overdueAmount:
 *                       type: string
 *                     lastTransactionDate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/outstanding', ctrl.getPartyOutstanding);

/**
 * @swagger
 * /api/parties/{id}/dealer-prices:
 *   post:
 *     summary: Set dealer-specific pricing
 *     description: Stores a custom per-dozen price for a dealer and design combination.
 *     tags: [Parties]
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
 *         description: Dealer UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - designId
 *               - pricePerDozen
 *             properties:
 *               designId:
 *                 type: string
 *                 format: uuid
 *               pricePerDozen:
 *                 type: string
 *                 example: '925.00'
 *     responses:
 *       201:
 *         description: Dealer pricing saved
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
 *                     dealerId:
 *                       type: string
 *                     designId:
 *                       type: string
 *                     pricePerDozen:
 *                       type: string
 *                     createdAt:
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
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/dealer-prices', ctrl.setDealerPrice);

/**
 * @swagger
 * /api/parties/{id}/dealer-prices:
 *   get:
 *     summary: Get dealer-specific pricing
 *     description: Returns all custom prices configured for a dealer across designs.
 *     tags: [Parties]
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
 *         description: Dealer UUID
 *     responses:
 *       200:
 *         description: Dealer price list
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
 *                       dealerId:
 *                         type: string
 *                       designId:
 *                         type: string
 *                       pricePerDozen:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/dealer-prices', ctrl.getDealerPrices);

export default router;

