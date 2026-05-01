import { Router, Request, Response } from 'express';
// node-fetch v2 is CommonJS — use require() to avoid ESM issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch') as typeof import('node-fetch').default;
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// POST /api/synthesize
router.post('/', async (req: Request, res: Response) => {
  const { text, voiceConfig } = req.body as {
    text: string;
    voiceConfig?: {
      voiceId?: string;
      stability?: number;
      similarityBoost?: number;
      style?: number;
      speakerBoost?: boolean;
    };
  };

  if (!text) {
    res.status(400).json({ error: 'text is required' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ElevenLabs API key not configured' });
    return;
  }

  const voiceId = voiceConfig?.voiceId || '21m00Tcm4TlvDq8ikWAM';

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: voiceConfig?.stability ?? 0.5,
            similarity_boost: voiceConfig?.similarityBoost ?? 0.75,
            style: voiceConfig?.style ?? 0,
            use_speaker_boost: voiceConfig?.speakerBoost ?? true,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      res.status(elevenRes.status).json({ error: errText });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    elevenRes.body.pipe(res);
  } catch (err) {
    console.error('Synthesize error:', err);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

export default router;
