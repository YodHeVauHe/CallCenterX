import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2/promise';

const router = Router();
router.use(authMiddleware);

// GET /api/calls?org_id=
router.get('/', async (req: AuthRequest, res: Response) => {
  const orgId = req.query['org_id'] as string;
  if (!orgId) { res.status(400).json({ error: 'org_id is required' }); return; }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*, a.name as agent_name
     FROM calls c
     LEFT JOIN agents a ON a.id = c.agent_id
     WHERE c.organization_id = ?
     ORDER BY c.started_at DESC`,
    [orgId]
  );
  res.json(rows);
});

// POST /api/calls
router.post('/', async (req: AuthRequest, res: Response) => {
  const { organization_id, agent_id, direction, caller_number } = req.body as Record<string, string>;
  const id = uuidv4();
  await pool.query(
    'INSERT INTO calls (id, organization_id, agent_id, direction, caller_number) VALUES (?, ?, ?, ?, ?)',
    [id, organization_id, agent_id || null, direction || 'inbound', caller_number || null]
  );
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM calls WHERE id = ?', [id]);
  res.status(201).json(rows[0]);
});

// PATCH /api/calls/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const { status, duration_seconds, sentiment_score, ended_at } = req.body as Record<string, unknown>;
  await pool.query(
    `UPDATE calls
     SET status = COALESCE(?, status),
         duration_seconds = COALESCE(?, duration_seconds),
         sentiment_score = COALESCE(?, sentiment_score),
         ended_at = COALESCE(?, ended_at)
     WHERE id = ?`,
    [status, duration_seconds, sentiment_score, ended_at, req.params['id']]
  );
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM calls WHERE id = ?', [req.params['id']]);
  res.json(rows[0]);
});

export default router;
