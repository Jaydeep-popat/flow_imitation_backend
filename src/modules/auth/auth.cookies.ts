import { CookieOptions, Request, Response } from 'express';

import {
	ACCESS_TOKEN_COOKIE_NAME,
	AUTH_COOKIE_DOMAIN,
	AUTH_COOKIE_SAME_SITE,
	IS_PRODUCTION,
	REFRESH_TOKEN_COOKIE_NAME,
} from '../../config/auth';

type AuthCookieInput = {
	accessToken: string;
	accessTokenMaxAgeMs: number;
	refreshToken: string;
	refreshTokenMaxAgeMs: number;
};

const buildCookieOptions = (maxAge: number, path: string): CookieOptions => ({
	httpOnly: true,
	secure: IS_PRODUCTION,
	sameSite: AUTH_COOKIE_SAME_SITE,
	domain: AUTH_COOKIE_DOMAIN,
	path,
	maxAge,
});

const accessCookieOptions = (maxAge: number) => buildCookieOptions(maxAge, '/');
const refreshCookieOptions = (maxAge: number) => buildCookieOptions(maxAge, '/api/auth');

export const setAuthCookies = (res: Response, input: AuthCookieInput): void => {
	res.cookie(
		ACCESS_TOKEN_COOKIE_NAME,
		input.accessToken,
		accessCookieOptions(input.accessTokenMaxAgeMs),
	);
	res.cookie(
		REFRESH_TOKEN_COOKIE_NAME,
		input.refreshToken,
		refreshCookieOptions(input.refreshTokenMaxAgeMs),
	);
};

export const clearAuthCookies = (res: Response): void => {
	res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, accessCookieOptions(0));
	res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions(0));
};

export const getAccessTokenFromRequest = (req: Request): string | undefined => {
	const cookieToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
	if (typeof cookieToken === 'string' && cookieToken.length > 0) {
		return cookieToken;
	}

	const authorizationHeader = req.header('authorization');
	if (authorizationHeader?.startsWith('Bearer ')) {
		return authorizationHeader.slice('Bearer '.length).trim();
	}

	return undefined;
};

export const getRefreshTokenFromRequest = (req: Request): string | undefined => {
	const cookieToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
	return typeof cookieToken === 'string' && cookieToken.length > 0
		? cookieToken
		: undefined;
};
