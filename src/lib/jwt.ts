import jwt, { JwtPayload } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET = rawSecret; // Type is now string (narrowed from string | undefined)

interface TokenPayload {
  [key: string]: string | number | boolean;
}

/**
 * Generate a JWT token with the provided payload
 * Token expires in 1 hour
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
}

/**
 * Verify and decode a JWT token
 * Throws an error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
}
