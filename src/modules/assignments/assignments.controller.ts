import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoAssignment = {
	id: 'uuid-a1',
	workerId: 'uuid-w1',
	designId: 'uuid-d1',
	rawMaterialTypeId: 'uuid-rm1',
	rawMaterialQty: 10,
	expectedPieces: 120,
	returnedPieces: 48,
	rejectedPieces: 2,
	pieceRateAtAssignment: '18.00',
	status: 'IN_PROGRESS',
	issuedAt: '2025-01-05T00:00:00.000Z',
};

const demoGoodsReturn = {
	id: 'uuid-gr1',
	assignmentId: 'uuid-a1',
	piecesReturned: 48,
	rejectedPieces: 2,
	acceptedPieces: 46,
	earningAmount: '828.00',
	returnedAt: '2025-01-15T00:00:00.000Z',
};

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllAssignments = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoAssignment,
			{ ...demoAssignment, id: 'uuid-a2', status: 'ISSUED' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/assignments/:id
 * @desc    Get assignment details by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAssignmentById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoAssignment, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/assignments
 * @desc    Create a new assignment.
 * @access  OWNER, MANAGER
 */
export const createAssignment = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoAssignment, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/assignments/:id/status
 * @desc    Update assignment status.
 * @access  OWNER, MANAGER
 */
export const updateAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Assignment ${req.params.id} status updated successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/assignments/:id/close
 * @desc    Close an assignment manually.
 * @access  OWNER, MANAGER
 */
export const closeAssignment = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Assignment ${req.params.id} closed successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/assignments/:id/returns
 * @desc    Record goods return against assignment.
 * @access  OWNER, MANAGER
 */
export const recordGoodsReturn = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoGoodsReturn, assignmentId: req.params.id }, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/assignments/:id/returns
 * @desc    Get all return entries for assignment.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAssignmentReturns = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, [
			{ ...demoGoodsReturn, assignmentId: req.params.id },
			{
				...demoGoodsReturn,
				id: 'uuid-gr2',
				assignmentId: req.params.id,
				piecesReturned: 30,
				acceptedPieces: 30,
				earningAmount: '540.00',
			},
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
