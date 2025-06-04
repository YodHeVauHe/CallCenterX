import { useState, useEffect, useCallback } from 'react';
import { VoiceAgent } from '@/lib/voice-agent';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_VOICE_CONFIG = {
  voiceId: 'default',
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.5,
  speakerBoost: true,
};

export function useVoiceAgent() {
  const [agent, setAgent] = useState<VoiceAgent | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (agent) {
        agent.endCall();
      }
    };
  }, [agent]);

  const startCall = useCallback(async () => {
    try {
      const newAgent = new VoiceAgent(DEFAULT_VOICE_CONFIG);
      await newAgent.startCall();
      setAgent(newAgent);
      setIsCallActive(true);
      
      toast({
        title: 'Call Started',
        description: 'Voice connection established',
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      toast({
        title: 'Error',
        description: 'Failed to start call',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const endCall = useCallback(() => {
    if (agent) {
      agent.endCall();
      setAgent(null);
      setIsCallActive(false);
      
      toast({
        title: 'Call Ended',
        description: 'Voice connection closed',
      });
    }
  }, [agent, toast]);

  return {
    isCallActive,
    startCall,
    endCall,
  };
}