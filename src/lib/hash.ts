import bcryptjs from "bcryptjs";

/**
 * Hash a plain text password using bcryptjs
 * Uses 10 salt rounds for security
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * Returns true if passwords match, false otherwise
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}
