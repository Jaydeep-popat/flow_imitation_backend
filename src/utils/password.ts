import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 */
export const hashPassword = async (
  plainPassword: string,
  saltRounds: number = DEFAULT_SALT_ROUNDS,
): Promise<string> => {
  return bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Compares a plain text password with a stored bcrypt hash.
 * Returns true when the password is valid.
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
