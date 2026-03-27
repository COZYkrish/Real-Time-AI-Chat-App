import { useEffect, useRef } from "react";

let sharedSocket = null;
let subscriberCount = 0;
let closeTimer = null;
let reconnectTimer = null;

function createSocket() {
  const socket = new WebSocket("ws://localhost:8000/ws");

  socket.onopen = () => {
    console.log("WebSocket connected ✅");
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected ❌");

    // Auto reconnect (after 1s)
    reconnectTimer = setTimeout(() => {
      if (subscriberCount > 0) {
        console.log("Reconnecting...");
        sharedSocket = createSocket();
      }
    }, 1000);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return socket;
}

function getSocket() {
  if (!sharedSocket || sharedSocket.readyState === WebSocket.CLOSED) {
    sharedSocket = createSocket();
  }
  return sharedSocket;
}

function scheduleSocketClose() {
  if (closeTimer) clearTimeout(closeTimer);

  closeTimer = setTimeout(() => {
    if (subscriberCount === 0 && sharedSocket) {
      sharedSocket.close();
      sharedSocket = null;
    }
    closeTimer = null;
  }, 500); // slight delay to prevent flicker
}

export default function useWebSocket(onMessage) {
  const onMessageRef = useRef(onMessage);
  const socketRef = useRef(null);

  onMessageRef.current = onMessage;

  useEffect(() => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    const socket = getSocket();
    socketRef.current = socket;
    subscriberCount++;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);

      subscriberCount = Math.max(0, subscriberCount - 1);

      if (subscriberCount === 0) {
        scheduleSocketClose();
      }
    };
  }, []);

  const sendMessage = (message) => {
    const socket = socketRef.current;

    if (!socket) {
      console.warn("No socket available");
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else if (socket.readyState === WebSocket.CONNECTING) {
      console.warn("Socket still connecting...");
    } else {
      console.warn("Socket closed, retrying...");
      sharedSocket = createSocket();
    }
  };

  return { sendMessage };
}