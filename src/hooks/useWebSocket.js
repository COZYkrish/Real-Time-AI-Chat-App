import { useEffect, useRef } from "react";

export default function useWebSocket(onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("⚠️ WebSocket Error:", error);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          role: "user",
          content: message
        })
      );
    } else {
      console.warn("⚠️ WebSocket not connected yet");
    }
  };

  return { sendMessage };
}