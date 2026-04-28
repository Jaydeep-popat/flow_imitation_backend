import { Router } from 'express';
import {
	requireActiveTenant,
	requireAuth,
} from '../../middleware/auth.middleware';
import * as ctrl from './auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Validates login credentials, sets HTTP-only access and refresh token cookies, and returns an access token plus tenant-aware user context.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: '9876543210'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'yourpassword'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *         headers:
 *           Set-Cookie:
 *             description: Sets the HTTP-only `accessToken` and `refreshToken` cookies.
 *             schema:
 *               type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tenant suspended - subscription inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', ctrl.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the current session
 *     description: Validates the refresh token cookie, rotates it, and sets a fresh pair of auth cookies.
 *     tags: [Auth]
 *     security:
 *       - refreshTokenCookie: []
 *     responses:
 *       200:
 *         description: Session refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSessionResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Replaces both the HTTP-only `accessToken` and `refreshToken` cookies.
 *             schema:
 *               type: string
 *       401:
 *         description: Missing, expired, invalid, or reused refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tenant suspended - subscription inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', ctrl.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     description: Requires a valid access token, clears auth cookies, and revokes the matching refresh token if the refresh cookie is present.
 *     tags: [Auth]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Clears the `accessToken` and `refreshToken` cookies.
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tenant suspended or insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', requireAuth, requireActiveTenant, ctrl.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the currently authenticated user's profile information.
 *     tags: [Auth]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tenant suspended or insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', requireAuth, requireActiveTenant, ctrl.getMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change account password
 *     description: Updates the password for the authenticated user, revokes all active refresh-token sessions for that user, and clears auth cookies so the user must log in again.
 *     tags: [Auth]
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Clears the `accessToken` and `refreshToken` cookies after the password change.
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Tenant suspended or insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/change-password', requireAuth, requireActiveTenant, ctrl.changePassword);

export default router;

