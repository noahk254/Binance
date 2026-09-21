import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { seedBalances } from '../services/account.service';
import { asyncHandler } from '../middleware/error';
import { HttpError } from '../utils/http-error';
import type { UserRow } from '../types';

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

authRouter.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { email, password } = credentialsSchema.parse(req.body);

    const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
    if (existing) throw new HttpError(409, 'An account with this email already exists');

    const info = db
      .prepare(`INSERT INTO users (email, password_hash) VALUES (?, ?)`)
      .run(email, hashPassword(password));
    const userId = Number(info.lastInsertRowid);
    seedBalances(userId);

    const token = signToken({ id: userId, email });
    res.status(201).json({ token, user: { id: userId, email } });
  }),
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = credentialsSchema.parse(req.body);

    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as UserRow | undefined;
    if (!user || !verifyPassword(password, user.password_hash)) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  }),
);
