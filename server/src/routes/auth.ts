import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2/promise';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES = '7d';

function makeToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email: string; password: string; name: string };
  if (!email || !password || !name) {
    res.status(400).json({ error: 'email, password and name are required' });
    return;
  }

  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ');

  try {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM profiles WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      'INSERT INTO profiles (id, email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?, ?)',
      [id, email, firstName, lastName, passwordHash]
    );

    const token = makeToken(id);
    res.status(201).json({ token, userId: id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, password_hash FROM profiles WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user['password_hash'] as string);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = makeToken(user['id'] as string);
    res.json({ token, userId: user['id'] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, first_name, last_name, created_at FROM profiles WHERE id = ?',
      [req.userId]
    );
    const profile = rows[0];
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const [orgs] = await pool.query<RowDataPacket[]>(
      `SELECT o.id, o.name, o.slug, o.created_at, o.updated_at
       FROM organizations o
       JOIN user_organizations uo ON uo.organization_id = o.id
       WHERE uo.user_id = ?`,
      [req.userId]
    );

    res.json({
      id: profile['id'],
      email: profile['email'],
      firstName: profile['first_name'],
      lastName: profile['last_name'],
      createdAt: profile['created_at'],
      organizations: orgs.map((o) => ({
        id: o['id'],
        name: o['name'],
        slug: o['slug'],
        createdAt: o['created_at'],
        updatedAt: o['updated_at'],
      })),
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
