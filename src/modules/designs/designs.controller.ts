import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoDesign = {
	id: 'uuid-1',
	designCode: 'AY-NK-001',
	name: 'Classic Stone Necklace',
	category: { id: 'uuid-c1', name: 'Necklace' },
	material: 'Gold Plated',
	finish: 'Glossy',
	diamondCount: 12,
	pieceRateRs: '18.00',
	salePricePerDozen: '960.00',
	isActive: true,
};

/**
 * @route   GET /api/designs
 * @desc    Get all designs.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllDesigns = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoDesign,
			{ ...demoDesign, id: 'uuid-2', designCode: 'AY-EAR-005', name: 'Pearl Drop Earring' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/designs/:id
 * @desc    Get design by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getDesignById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoDesign, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/designs
 * @desc    Create a new design.
 * @access  OWNER, MANAGER
 */
export const createDesign = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoDesign, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/designs/:id
 * @desc    Update design details.
 * @access  OWNER, MANAGER
 */
export const updateDesign = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoDesign, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/designs/:id/deactivate
 * @desc    Deactivate a design.
 * @access  OWNER, MANAGER
 */
export const deactivateDesign = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Design ${req.params.id} deactivated successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/designs/categories
 * @desc    Get all design categories.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			{ id: 'uuid-c1', name: 'Necklace' },
			{ id: 'uuid-c2', name: 'Earring' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/designs/categories
 * @desc    Create a design category.
 * @access  OWNER, MANAGER
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, { id: 'uuid-c1', name: 'Necklace' }, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
