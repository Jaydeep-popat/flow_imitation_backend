import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoParty = {
	id: 'uuid-p1',
	partyType: 'DEALER',
	name: 'Mehta Jewels',
	phone: '9712345678',
	city: 'Surat',
	gstNumber: '24ABCDE1234F1Z5',
	creditLimit: '50000.00',
	creditDays: 30,
	openingBalance: '0.00',
	isActive: true,
};

const demoLedger = {
	date: '2025-01-10T00:00:00.000Z',
	type: 'INVOICE',
	reference: 'ORD-2025-0001',
	debit: '12000.00',
	credit: '0.00',
	balance: '12000.00',
};

/**
 * @route   GET /api/parties
 * @desc    Get all parties.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllParties = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoParty,
			{ ...demoParty, id: 'uuid-p2', name: 'Patel Suppliers', partyType: 'SUPPLIER' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/dealers
 * @desc    Get all dealers.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllDealers = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [demoParty, { ...demoParty, id: 'uuid-p3', name: 'Kavya Jewels' }]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/suppliers
 * @desc    Get all suppliers.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ ...demoParty, id: 'uuid-s1', partyType: 'SUPPLIER', name: 'Rhodium Traders' },
			{ ...demoParty, id: 'uuid-s2', partyType: 'SUPPLIER', name: 'Stone Hub' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/:id
 * @desc    Get party by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPartyById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoParty, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/parties
 * @desc    Create party.
 * @access  OWNER, MANAGER
 */
export const createParty = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoParty, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/parties/:id
 * @desc    Update party details.
 * @access  OWNER, MANAGER
 */
export const updateParty = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoParty, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/parties/:id/deactivate
 * @desc    Deactivate party profile.
 * @access  OWNER, MANAGER
 */
export const deactivateParty = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Party ${req.params.id} deactivated successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/:id/ledger
 * @desc    Get ledger for a party.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPartyLedger = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoLedger,
			{
				...demoLedger,
				reference: 'PAY-2025-001',
				type: 'PAYMENT',
				debit: '0.00',
				credit: '3000.00',
				balance: '9000.00',
			},
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/:id/outstanding
 * @desc    Get outstanding summary for party.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPartyOutstanding = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			partyId: 'uuid-p1',
			outstandingAmount: '12000.00',
			overdueAmount: '5000.00',
			lastTransactionDate: '2025-01-12T00:00:00.000Z',
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/parties/:id/dealer-prices
 * @desc    Set dealer-specific design pricing.
 * @access  OWNER, MANAGER
 */
export const setDealerPrice = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(
			res,
			{
				id: 'uuid-dp1',
				dealerId: 'uuid-p1',
				designId: 'uuid-d1',
				pricePerDozen: '925.00',
				createdAt: '2025-01-20T00:00:00.000Z',
			},
			201,
		);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/parties/:id/dealer-prices
 * @desc    Get dealer-specific price list.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getDealerPrices = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ id: 'uuid-dp1', dealerId: 'uuid-p1', designId: 'uuid-d1', pricePerDozen: '925.00' },
			{ id: 'uuid-dp2', dealerId: 'uuid-p1', designId: 'uuid-d2', pricePerDozen: '780.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
