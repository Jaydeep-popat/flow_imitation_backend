import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoSupplementary = {
	id: 'uuid-1',
	name: 'White Round Stones',
	unit: 'pieces',
	stockQuantity: 5000,
	isActive: true,
};

/**
 * @route   GET /api/supplementary
 * @desc    Get all supplementary material types.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllSupplementaryTypes = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoSupplementary,
			{ ...demoSupplementary, id: 'uuid-2', name: 'Golden Fittings', stockQuantity: 1200 },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/supplementary
 * @desc    Create supplementary material type.
 * @access  OWNER, MANAGER
 */
export const createSupplementaryType = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoSupplementary, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/supplementary/:id
 * @desc    Update supplementary material type.
 * @access  OWNER, MANAGER
 */
export const updateSupplementaryType = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoSupplementary, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/supplementary/:id/stock
 * @desc    Adjust supplementary stock quantity.
 * @access  OWNER, MANAGER
 */
export const adjustStock = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Stock adjusted successfully for supplementary material ${req.params.id}` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/supplementary/issuances
 * @desc    Get all supplementary material issuances.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllIssuances = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ id: 'uuid-i1', assignmentId: 'uuid-a1', materialId: 'uuid-1', quantity: 1000, issuedAt: '2025-01-12T00:00:00.000Z' },
			{ id: 'uuid-i2', assignmentId: 'uuid-a2', materialId: 'uuid-2', quantity: 250, issuedAt: '2025-01-13T00:00:00.000Z' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
