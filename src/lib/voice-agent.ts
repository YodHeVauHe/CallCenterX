import { v4 as uuidv4 } from 'uuid';
import { pipeline } from '@xenova/transformers';
import { getToken } from '@/lib/api';

interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class VoiceAgent {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext;
  private mediaRecorder: MediaRecorder | null = null;
  private voiceConfig: VoiceConfig;
  private sessionId: string;
  private pipeline: any;

  constructor(voiceConfig: VoiceConfig) {
    this.voiceConfig = voiceConfig;
    this.sessionId = uuidv4();
    this.audioContext = new AudioContext();
    this.initializePipeline();
  }

  private async initializePipeline() {
    try {
      this.pipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
    } catch (error) {
      console.error('Failed to initialize ASR pipeline:', error);
    }
  }

  public async startCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.setupAudioProcessing(stream);
      this.connectWebSocket();
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  }

  private setupAudioProcessing(stream: MediaStream) {
    const source = this.audioContext.createMediaStreamSource(stream);
    const processor = this.audioContext.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(this.audioContext.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      this.processAudioChunk(inputData);
    };

    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = this.handleAudioData.bind(this);
    this.mediaRecorder.start(100);
  }

  private async processAudioChunk(audioData: Float32Array) {
    try {
      const transcription = await this.pipeline(audioData);
      if (transcription && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'transcription',
          sessionId: this.sessionId,
          text: transcription,
        }));
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }

  private connectWebSocket() {
    // Connect to the socket.io server's websocket endpoint
    const wsUrl = SERVER_URL.replace(/^http/, 'ws') + '/socket.io/?EIO=4&transport=websocket';
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = this.handleServerMessage.bind(this);
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private async handleServerMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'response') {
        await this.synthesizeAndPlay(data.text);
      }
    } catch {
      // ignore non-JSON frames (socket.io handshake frames)
    }
  }

  private async synthesizeAndPlay(text: string) {
    try {
      const token = getToken();
      const response = await fetch(`${SERVER_URL}/api/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text,
          voiceConfig: this.voiceConfig,
        }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    }
  }

  private handleAudioData(event: BlobEvent) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(event.data);
    }
  }

  public endCall() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.socket) {
      this.socket.close();
    }
    this.audioContext.close();
  }
}
