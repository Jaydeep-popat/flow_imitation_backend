import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoInventory = {
	id: 'uuid-inv1',
	designId: 'uuid-d1',
	design: { designCode: 'AY-NK-001', name: 'Classic Stone Necklace' },
	unpackagedPieces: 84,
	packagedDozens: 15,
	lowStockAlertAt: 5,
	updatedAt: '2025-01-20T00:00:00.000Z',
};

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory stock rows.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllInventory = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoInventory,
			{ ...demoInventory, id: 'uuid-inv2', designId: 'uuid-d2', packagedDozens: 2 },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/inventory/:designId
 * @desc    Get inventory details for a design.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getInventoryByDesign = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoInventory, designId: req.params.designId });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/inventory/package
 * @desc    Create packaging batch for inventory.
 * @access  OWNER, MANAGER
 */
export const createPackagingBatch = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(
			res,
			{
				id: 'uuid-pb1',
				stockId: 'uuid-inv1',
				dozensPackaged: 3,
				piecesUsed: 36,
				packedAt: '2025-01-20T00:00:00.000Z',
			},
			201,
		);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/inventory/packaging-history
 * @desc    Get packaging history entries.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPackagingHistory = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ id: 'uuid-pb1', stockId: 'uuid-inv1', dozensPackaged: 3, piecesUsed: 36, packedAt: '2025-01-20T00:00:00.000Z' },
			{ id: 'uuid-pb2', stockId: 'uuid-inv2', dozensPackaged: 1, piecesUsed: 12, packedAt: '2025-01-21T00:00:00.000Z' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/inventory/:designId/alert
 * @desc    Set low stock alert threshold for a design.
 * @access  OWNER, MANAGER
 */
export const setLowStockAlert = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Low stock alert updated for design ${req.params.designId}` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
