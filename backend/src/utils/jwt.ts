import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { AuthedRequestUser } from '../types';

export function signToken(user: AuthedRequestUser): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function verifyToken(token: string): AuthedRequestUser {
  return jwt.verify(token, config.jwtSecret) as AuthedRequestUser;
}
