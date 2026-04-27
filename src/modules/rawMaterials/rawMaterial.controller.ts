import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoMaterialType = {
	id: 'uuid-1',
	name: 'Gold Plated Metal Base',
	unit: 'KG',
	isActive: true,
};

const demoPurchase = {
	id: 'uuid-1',
	materialTypeId: 'uuid-1',
	supplierId: 'uuid-s1',
	quantity: 50,
	costPerUnit: '120.00',
	totalCost: '6000.00',
	purchaseDate: '2025-01-10T00:00:00.000Z',
};

/**
 * @route   GET /api/raw-materials/types
 * @desc    Get all raw material types.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllMaterialTypes = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoMaterialType,
			{ ...demoMaterialType, id: 'uuid-2', name: 'Rhodium Base' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/raw-materials/types
 * @desc    Create a raw material type.
 * @access  OWNER, MANAGER
 */
export const createMaterialType = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoMaterialType, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/raw-materials/types/:id
 * @desc    Update raw material type details.
 * @access  OWNER, MANAGER
 */
export const updateMaterialType = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoMaterialType, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/raw-materials/purchases
 * @desc    Get all raw material purchases.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllPurchases = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoPurchase,
			{ ...demoPurchase, id: 'uuid-2', quantity: 30, totalCost: '3600.00' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/raw-materials/purchases/:id
 * @desc    Get purchase details by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoPurchase, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/raw-materials/purchases
 * @desc    Create a raw material purchase entry.
 * @access  OWNER, MANAGER
 */
export const createPurchase = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoPurchase, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/raw-materials/stock
 * @desc    Get current stock by material type.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getRawMaterialStock = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ materialType: 'Gold Plated Metal Base', unit: 'KG', totalPurchased: 100, totalIssued: 45.5, currentStock: 54.5 },
			{ materialType: 'Rhodium Base', unit: 'KG', totalPurchased: 20, totalIssued: 7.5, currentStock: 12.5 },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
