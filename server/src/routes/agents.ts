import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2/promise';

const router = Router();
router.use(authMiddleware);

// GET /api/agents?org_id=
router.get('/', async (req: AuthRequest, res: Response) => {
  const orgId = req.query['org_id'] as string;
  if (!orgId) { res.status(400).json({ error: 'org_id is required' }); return; }
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM agents WHERE organization_id = ? ORDER BY name',
    [orgId]
  );
  res.json(rows);
});

// POST /api/agents
router.post('/', async (req: AuthRequest, res: Response) => {
  const { organization_id, name, email } = req.body as Record<string, string>;
  const id = uuidv4();
  await pool.query(
    'INSERT INTO agents (id, organization_id, name, email) VALUES (?, ?, ?, ?)',
    [id, organization_id, name, email || null]
  );
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM agents WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

export default router;
