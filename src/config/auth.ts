const MIN_SECRET_LENGTH = 32;

const parseDurationToSeconds = (
	value: string | undefined,
	fallbackSeconds: number,
): number => {
	if (!value) {
		return fallbackSeconds;
	}

	const normalized = value.trim().toLowerCase();
	const plainNumber = Number(normalized);
	if (!Number.isNaN(plainNumber) && plainNumber > 0) {
		return Math.floor(plainNumber);
	}

	const match = normalized.match(/^(\d+)([smhd])$/);
	if (!match) {
		return fallbackSeconds;
	}

	const amount = Number(match[1]);
	const unit = match[2];

	switch (unit) {
		case 's':
			return amount;
		case 'm':
			return amount * 60;
		case 'h':
			return amount * 60 * 60;
		case 'd':
			return amount * 60 * 60 * 24;
		default:
			return fallbackSeconds;
	}
};

const parseSameSite = (value?: string): 'lax' | 'strict' | 'none' => {
	switch (value?.toLowerCase()) {
		case 'strict':
			return 'strict';
		case 'none':
			return 'none';
		case 'lax':
		default:
			return 'lax';
	}
};

const ensureSecret = (name: string, value?: string): string => {
	if (!value) {
		throw new Error(`${name} is not configured`);
	}

	if (value.length < MIN_SECRET_LENGTH) {
		throw new Error(`${name} must be at least ${MIN_SECRET_LENGTH} characters long`);
	}

	return value;
};

const rawAccessSecret = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
const rawRefreshSecret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;

export const ACCESS_TOKEN_SECRET = ensureSecret('JWT_ACCESS_SECRET', rawAccessSecret);
export const REFRESH_TOKEN_SECRET = ensureSecret('JWT_REFRESH_SECRET', rawRefreshSecret);

export const ACCESS_TOKEN_TTL_SECONDS = parseDurationToSeconds(
	process.env.JWT_ACCESS_EXPIRES_IN ?? '30m',
	30 * 60,
);
export const REFRESH_TOKEN_TTL_SECONDS = parseDurationToSeconds(
	process.env.JWT_REFRESH_EXPIRES_IN ?? process.env.JWT_EXPIRES_IN ?? '7d',
	7 * 24 * 60 * 60,
);

export const ACCESS_TOKEN_COOKIE_NAME =
	process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME =
	process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refreshToken';
export const AUTH_COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;
export const AUTH_COOKIE_SAME_SITE = parseSameSite(process.env.AUTH_COOKIE_SAME_SITE);
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
