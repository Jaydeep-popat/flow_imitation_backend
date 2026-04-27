import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';

const demoWorker = {
	id: 'uuid-w1',
	name: 'Ramesh Patel',
	phone: '9898989898',
	address: 'Gota, Ahmedabad',
	idProofType: 'Aadhar',
	idProofNumber: 'XXXX-XXXX-1234',
	isActive: true,
};

/**
 * @route   GET /api/workers
 * @desc    Get all workers.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getAllWorkers = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, [
			demoWorker,
			{ ...demoWorker, id: 'uuid-w2', name: 'Suresh Bhai', phone: '9090909090' },
		]);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/workers/:id
 * @desc    Get worker by ID.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getWorkerById = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoWorker, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   POST /api/workers
 * @desc    Create a worker.
 * @access  OWNER, MANAGER
 */
export const createWorker = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, demoWorker, 201);
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/workers/:id
 * @desc    Update worker details.
 * @access  OWNER, MANAGER
 */
export const updateWorker = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { ...demoWorker, id: req.params.id });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   PATCH /api/workers/:id/deactivate
 * @desc    Deactivate worker profile.
 * @access  OWNER, MANAGER
 */
export const deactivateWorker = async (req: Request, res: Response): Promise<void> => {
	try {
		successResponse(res, { message: `Worker ${req.params.id} deactivated successfully` });
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};

/**
 * @route   GET /api/workers/:id/summary
 * @desc    Get worker summary for earnings and assignments.
 * @access  OWNER, MANAGER, VIEWER
 */
export const getWorkerSummary = async (req: Request, res: Response): Promise<void> => {
	try {
		void req;
		successResponse(res, {
			worker: { id: 'uuid-w1', name: 'Ramesh Patel' },
			totalEarnings: '4500.00',
			totalPaid: '3000.00',
			outstandingBalance: '1500.00',
			activeAssignments: 2,
			totalPiecesDelivered: 250,
		});
	} catch (err: any) {
		errorResponse(res, err.message);
	}
};
