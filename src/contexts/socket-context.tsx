import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { getToken } from '@/lib/api';

type SocketContextType = {
  connected: boolean;
  sendMessage: (event: string, data: unknown) => void;
  subscribeToEvent: (event: string, callback: (data: unknown) => void) => void;
  unsubscribeFromEvent: (event: string) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const token = getToken();
    const socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.io connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.io connection error:', err.message);
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]);

  const sendMessage = (event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  };

  const subscribeToEvent = (event: string, callback: (data: unknown) => void) => {
    socketRef.current?.on(event, callback);
  };

  const unsubscribeFromEvent = (event: string) => {
    socketRef.current?.off(event);
  };

  return (
    <SocketContext.Provider value={{ connected, sendMessage, subscribeToEvent, unsubscribeFromEvent }}>
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
