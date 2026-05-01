import 'dotenv/config';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server as SocketIO, Socket } from 'socket.io';
import { testConnection, ensureDatabase, pool } from './db';

import authRoutes from './routes/auth';
import organizationRoutes from './routes/organizations';
import callRoutes from './routes/calls';
import agentRoutes from './routes/agents';
import synthesizeRoute from './routes/synthesize';

const app = express();
const server = http.createServer(app);

// --- Socket.io for voice pipeline ---
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

interface TranscriptionPayload {
  sessionId: string;
  text: string;
}

io.on('connection', (socket: Socket) => {
  console.log('Voice socket connected:', socket.id);

  socket.on('transcription', (data: TranscriptionPayload) => {
    console.log('Transcription received:', data.text);
    // Echo a placeholder response back — replace with real AI logic.
    socket.emit('response', {
      type: 'response',
      text: `You said: "${data.text}". How can I help you further?`,
    });
  });

  socket.on('disconnect', () => {
    console.log('Voice socket disconnected:', socket.id);
  });
});

// --- Express middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/synthesize', synthesizeRoute);

app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }));

// --- Boot ---
async function main(): Promise<void> {
  // Verify Dolt is reachable and bootstrap the database
  try {
    await ensureDatabase();
    await testConnection();
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ECONNREFUSED') {
      console.error(
        `Cannot connect to Dolt at ${process.env.DOLT_HOST || '127.0.0.1'}:${process.env.DOLT_PORT || 3306}.\n` +
        `Make sure Dolt is running:  dolt sql-server --port 3306`
      );
    } else {
      console.error('Database connection failed:', (err as Error).message);
    }
    process.exit(1);
  }

  // Apply schema (CREATE TABLE IF NOT EXISTS — safe to run every boot)
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    const statements = sql
      .split(';')
      .map((stmt: string) => stmt.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
  } catch (err) {
    console.error('Schema migration failed:', (err as Error).message);
    process.exit(1);
  }

  const port = Number(process.env.PORT) || 4000;
  server.listen(port, () => {
    console.log(`CallCenterX server  →  http://localhost:${port}`);
  });
}

main().catch((err: Error) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
