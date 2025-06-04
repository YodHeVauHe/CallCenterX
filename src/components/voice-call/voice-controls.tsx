import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/use-voice-agent';

export function VoiceControls() {
  const [isMuted, setIsMuted] = useState(false);
  const { isCallActive, startCall, endCall } = useVoiceAgent();

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Additional mute logic would be implemented here
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {isCallActive ? (
        <>
          <Button
            variant={isMuted ? "default" : "outline"}
            size="icon"
            className={`h-12 w-12 rounded-full ${
              isMuted ? "bg-red-500 hover:bg-red-600" : ""
            }`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={endCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </>
      ) : (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={startCall}
        >
          <Phone className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}