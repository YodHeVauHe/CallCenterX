import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

type SocketContextType = {
  connected: boolean;
  sendMessage: (event: string, data: any) => void;
  subscribeToEvent: (event: string, callback: (data: any) => void) => void;
  unsubscribeFromEvent: (event: string) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [eventListeners, setEventListeners] = useState<Record<string, ((data: any) => void)[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // In a real app, this would connect to a real WebSocket server
    // For now, we'll simulate the connection
    console.log('Simulating WebSocket connection...');
    setConnected(true);

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.close();
      }
      setConnected(false);
    };
  }, [user]);

  const sendMessage = (event: string, data: any) => {
    if (!connected) return;
    console.log(`Sending event: ${event}`, data);
    // In a real app, this would send to the WebSocket
    // socket?.send(JSON.stringify({ event, data }));
  };

  const subscribeToEvent = (event: string, callback: (data: any) => void) => {
    setEventListeners((prev) => {
      const listeners = prev[event] || [];
      return {
        ...prev,
        [event]: [...listeners, callback],
      };
    });
  };

  const unsubscribeFromEvent = (event: string) => {
    setEventListeners((prev) => {
      const { [event]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        sendMessage,
        subscribeToEvent,
        unsubscribeFromEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}