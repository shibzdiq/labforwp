// frontend/src/app/providers/SocketProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/core/config/env";
import { tokenStore } from "@/core/auth/tokenStore";
import { useAuthStore } from "@/store/auth.store";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // якщо немає юзера — відключаємось
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const accessToken = tokenStore.getAccessToken();
    if (!accessToken) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || API_URL;

    const s = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: accessToken },
      autoConnect: true,
      reconnection: true,
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected", s.id);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]); // при зміні юзера — перебудова з'єднання

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
