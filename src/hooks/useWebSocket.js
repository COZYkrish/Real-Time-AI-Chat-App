import { useEffect, useRef } from "react"

export default function useWebSocket(onMessage) {
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws")

    ws.current.onmessage = (event) => {
      onMessage(event.data)
    }

    return () => {
      ws.current.close()
    }
  }, [])

  const sendMessage = (message) => {
    ws.current.send(message)
  }

  return { sendMessage }
}