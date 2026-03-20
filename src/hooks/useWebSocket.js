import { useEffect, useRef } from "react";

let sharedSocket = null;
let subscriberCount = 0;
let closeTimer = null;

function getSocket() {
  if (!sharedSocket || sharedSocket.readyState === WebSocket.CLOSED) {
    sharedSocket = new WebSocket("ws://localhost:8000/ws");
  }

  return sharedSocket;
}

function scheduleSocketClose() {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }

  closeTimer = setTimeout(() => {
    if (subscriberCount === 0 && sharedSocket) {
      sharedSocket.close();
      sharedSocket = null;
    }

    closeTimer = null;
  }, 0);
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
    subscriberCount += 1;

    const handleOpen = () => {
      console.log("WebSocket connected");
    };

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageRef.current(data);
    };

    const handleClose = () => {
      console.log("WebSocket disconnected");

      if (sharedSocket === socket) {
        sharedSocket = null;
      }
    };

    const handleError = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);

      subscriberCount = Math.max(0, subscriberCount - 1);

      if (subscriberCount === 0) {
        scheduleSocketClose();
      }
    };
  }, []);

  const sendMessage = (message) => {
    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected yet");
    }
  };

  return { sendMessage };
}
