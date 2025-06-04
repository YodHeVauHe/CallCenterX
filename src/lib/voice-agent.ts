import { v4 as uuidv4 } from 'uuid';
import { pipeline } from '@xenova/transformers';
import { useSocket } from '@/contexts/socket-context';
import { useToast } from '@/hooks/use-toast';

interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

export class VoiceAgent {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext;
  private mediaRecorder: MediaRecorder | null = null;
  private voiceConfig: VoiceConfig;
  private sessionId: string;
  private pipeline: any;
  private toast: any;

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
      this.toast({
        title: 'Error',
        description: 'Failed to initialize voice system',
        variant: 'destructive',
      });
    }
  }

  public async startCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.setupAudioProcessing(stream);
      this.connectWebSocket();
    } catch (error) {
      console.error('Failed to start call:', error);
      this.toast({
        title: 'Error',
        description: 'Failed to access microphone',
        variant: 'destructive',
      });
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
          text: transcription
        }));
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }

  private connectWebSocket() {
    const wsUrl = `${import.meta.env.VITE_SUPABASE_URL}/realtime/v1/voice`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = this.handleServerMessage.bind(this);
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.toast({
        title: 'Connection Error',
        description: 'Lost connection to voice server',
        variant: 'destructive',
      });
    };
  }

  private async handleServerMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    if (data.type === 'response') {
      await this.synthesizeAndPlay(data.text);
    }
  }

  private async synthesizeAndPlay(text: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text,
          voiceConfig: this.voiceConfig
        }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      this.toast({
        title: 'Error',
        description: 'Failed to synthesize speech',
        variant: 'destructive',
      });
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