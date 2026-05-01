import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2/promise';

const router = Router();
router.use(authMiddleware);

// GET /api/organizations
router.get('/', async (req: AuthRequest, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT o.id, o.name, o.slug, o.created_at, o.updated_at
     FROM organizations o
     JOIN user_organizations uo ON uo.organization_id = o.id
     WHERE uo.user_id = ?`,
    [req.userId]
  );
  res.json(rows);
});

// POST /api/organizations
router.post('/', async (req: AuthRequest, res: Response) => {
  const { name, slug } = req.body as { name: string; slug: string };
  if (!name || !slug) {
    res.status(400).json({ error: 'name and slug are required' });
    return;
  }

  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)',
      [id, name, slug]
    );
    await pool.query(
      'INSERT INTO user_organizations (user_id, organization_id, role) VALUES (?, ?, ?)',
      [req.userId, id, 'owner']
    );
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );
    res.status(201).json(rows[0]);
  } catch (err: unknown) {
    const mysqlErr = err as { code?: string; message?: string };
    if (mysqlErr.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Slug already taken' });
    } else {
      console.error('Create org error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
