import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import type { AuthedRequestUser } from '../types';

export function signToken(user: AuthedRequestUser): string {
  // Environment variables are strings, while jsonwebtoken's current types
  // correctly restrict this to its duration-string format (for example, "7d").
  const expiresIn = config.jwtExpiresIn as NonNullable<SignOptions['expiresIn']>;
  return jwt.sign(user, config.jwtSecret, { expiresIn });
}

export function verifyToken(token: string): AuthedRequestUser {
  return jwt.verify(token, config.jwtSecret) as AuthedRequestUser;
}
