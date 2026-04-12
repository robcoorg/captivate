import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../db.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { sendWelcome } from '../../email.js';

const router = Router();
const COOKIE = 'ns_session';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
};

function signToken(userId: string, email: string, tier: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ userId, email, tier }, secret, { expiresIn: '30d' });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: { code: 'missing_params', message: 'Email and password are required.' } });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: { code: 'weak_password', message: 'Password must be at least 8 characters.' } });
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: { code: 'email_taken', message: 'An account with that email already exists.' } });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, tier`,
      [email.toLowerCase(), hash],
    );
    const user = result.rows[0];
    const token = signToken(user.id, user.email, user.tier);
    res.cookie(COOKIE, token, COOKIE_OPTS);
    sendWelcome(user.email);
    res.status(201).json({ user: { id: user.id, email: user.email, tier: user.tier } });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: { code: 'missing_params', message: 'Email and password are required.' } });
  }

  try {
    const result = await query(
      'SELECT id, email, tier, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()],
    );
    const user = result.rows[0];

    // Consistent timing — always compare even if user not found
    const hash = user?.password_hash ?? '$2a$12$invalidhashpadding000000000000000000000000000000000000';
    const match = await bcrypt.compare(password, hash);

    if (!user || !match) {
      return res.status(401).json({ error: { code: 'invalid_credentials', message: 'Incorrect email or password.' } });
    }

    const token = signToken(user.id, user.email, user.tier);
    res.cookie(COOKIE, token, COOKIE_OPTS);
    res.json({ user: { id: user.id, email: user.email, tier: user.tier } });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

// GET /api/auth/me — returns current user from DB (fresh tier/entitlements)
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, email, tier FROM users WHERE id = $1',
      [req.user!.userId],
    );
    const user = result.rows[0];
    if (!user) {
      res.clearCookie(COOKIE, { path: '/' });
      return res.status(401).json({ error: { code: 'unauthorized', message: 'Account not found.' } });
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'server_error', message: err.message } });
  }
});

export default router;
