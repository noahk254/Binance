import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import type { AuthedRequestUser } from '../types';

export interface AuthedRequest extends Request {
  user?: AuthedRequestUser;
}

/** Reads `Authorization: Bearer <token>` and attaches the decoded user, or 401s. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  try {
    req.user = verifyToken(header.slice('Bearer '.length));
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
