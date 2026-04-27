import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

/**
 * @route   GET /api/reports/sales
 * @desc    Get sales report summary.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getSalesReport = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ date: '2025-01-10', orders: 5, revenue: '24000.00' },
			{ date: '2025-01-11', orders: 3, revenue: '18000.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/reports/stock
 * @desc    Get stock report across inventory and materials.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getStockReport = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ designCode: 'AY-NK-001', packagedDozens: 15, unpackagedPieces: 84 },
			{ designCode: 'AY-EAR-005', packagedDozens: 2, unpackagedPieces: 10 },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/reports/workers
 * @desc    Get worker performance report.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getWorkerReport = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ workerId: 'uuid-w1', workerName: 'Ramesh Patel', acceptedPieces: 250, earnings: '4500.00' },
			{ workerId: 'uuid-w2', workerName: 'Suresh Bhai', acceptedPieces: 190, earnings: '3420.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/reports/purchases
 * @desc    Get raw material purchase report.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPurchaseReport = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ purchaseId: 'uuid-1', materialType: 'Gold Plated Metal Base', quantity: 50, totalCost: '6000.00' },
			{ purchaseId: 'uuid-2', materialType: 'Rhodium Base', quantity: 30, totalCost: '3600.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/reports/profit-overview
 * @desc    Get profit overview summary.
 * @access  OWNER, MANAGER
 */
export const getProfitOverview = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			grossSales: '240000.00',
			materialCost: '90000.00',
			laborCost: '45000.00',
			netProfit: '105000.00',
			marginPercent: '43.75',
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/reports/dashboard
 * @desc    Get dashboard summary cards and alerts.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			todaySales: { ordersDispatched: 3, revenueCollected: '18000.00' },
			lowStockDesigns: [{ designCode: 'AY-EAR-005', name: 'Pearl Drop Earring', packagedDozens: 2 }],
			topOverdueParties: [{ name: 'Mehta Jewels', outstanding: '12000.00', daysOverdue: 5 }],
			activeWorkerAssignments: 8,
			rawMaterialAlerts: [{ material: 'Rhodium Base', currentStock: 2.5, unit: 'KG' }],
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
