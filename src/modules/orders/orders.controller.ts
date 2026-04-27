import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoOrder = {
	id: 'uuid-o1',
	orderNumber: 'ORD-2025-0001',
	dealer: { id: 'uuid-p1', name: 'Mehta Jewels', city: 'Surat' },
	status: 'DISPATCHED',
	items: [
		{
			id: 'uuid-oi1',
			design: { designCode: 'AY-NK-001', name: 'Classic Stone Necklace' },
			quantityDozens: 5,
			pricePerDozen: '960.00',
			lineTotal: '4800.00',
			dispatchedDozens: 5,
		},
	],
	subtotalAmount: '4800.00',
	discountAmount: '0.00',
	totalAmount: '4800.00',
	isCreditOrder: true,
	dueDate: '2025-02-10T00:00:00.000Z',
	dispatchedAt: '2025-01-11T00:00:00.000Z',
	transportMode: 'DTDC',
};

/**
 * @route   GET /api/orders
 * @desc    Get all orders.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoOrder,
			{ ...demoOrder, id: 'uuid-o2', orderNumber: 'ORD-2025-0002', status: 'CONFIRMED' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoOrder, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/orders
 * @desc    Create a new order.
 * @access  OWNER, MANAGER
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoOrder, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/orders/:id/confirm
 * @desc    Confirm draft order.
 * @access  OWNER, MANAGER
 */
export const confirmOrder = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Order ${req.params.id} confirmed successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/orders/:id/pack
 * @desc    Mark order as packed.
 * @access  OWNER, MANAGER
 */
export const markAsPacked = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Order ${req.params.id} marked as packed` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/orders/:id/dispatch
 * @desc    Dispatch order.
 * @access  OWNER, MANAGER
 */
export const dispatchOrder = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Order ${req.params.id} dispatched successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel order.
 * @access  OWNER, MANAGER
 */
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Order ${req.params.id} cancelled successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/orders/overdue
 * @desc    Get overdue credit orders.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getOverdueOrders = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ orderId: 'uuid-o1', orderNumber: 'ORD-2025-0001', dealerName: 'Mehta Jewels', dueDate: '2025-02-10T00:00:00.000Z', outstanding: '12000.00' },
			{ orderId: 'uuid-o3', orderNumber: 'ORD-2025-0003', dealerName: 'Kavya Jewels', dueDate: '2025-02-12T00:00:00.000Z', outstanding: '5000.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
