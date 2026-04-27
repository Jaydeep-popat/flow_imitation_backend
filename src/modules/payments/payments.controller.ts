import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoPayment = {
	id: 'uuid-pay1',
	paymentType: 'DEALER_PAYMENT',
	paymentMode: 'UPI',
	partyId: 'uuid-p1',
	orderId: 'uuid-o1',
	amount: '4800.00',
	isAdvance: false,
	paidAt: '2025-01-12T00:00:00.000Z',
	notes: 'Full payment received',
};

/**
 * @route   GET /api/payments
 * @desc    Get all payment records.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoPayment,
			{ ...demoPayment, id: 'uuid-pay2', paymentMode: 'CASH', amount: '2500.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoPayment, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/payments/dealer
 * @desc    Record payment received from dealer.
 * @access  OWNER, MANAGER
 */
export const recordDealerPayment = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, { ...demoPayment, paymentType: 'DEALER_PAYMENT' }, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/payments/supplier
 * @desc    Record payment made to supplier.
 * @access  OWNER, MANAGER
 */
export const recordSupplierPayment = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(
			res,
			{ ...demoPayment, paymentType: 'SUPPLIER_PAYMENT', partyId: 'uuid-s1' },
			201,
		);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/payments/worker
 * @desc    Record payment made to worker.
 * @access  OWNER, MANAGER
 */
export const recordWorkerPayment = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(
			res,
			{
				...demoPayment,
				paymentType: 'WORKER_PAYMENT',
				partyId: null,
				orderId: null,
				notes: 'Weekly worker payout',
			},
			201,
		);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/payments/outstanding
 * @desc    Get outstanding amount report by dealer.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getOutstandingReport = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			totalOutstanding: '85000.00',
			dealers: [
				{
					dealerId: 'uuid-p1',
					dealerName: 'Mehta Jewels',
					outstanding: '12000.00',
					oldestDue: '2025-01-10T00:00:00.000Z',
					agingBucket: '0-30 days',
				},
			],
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/payments/cashflow
 * @desc    Get daily cashflow summary.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getDailyCashflow = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ date: '2025-01-12', inflow: '18000.00', outflow: '9000.00', net: '9000.00' },
			{ date: '2025-01-13', inflow: '12500.00', outflow: '4500.00', net: '8000.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
