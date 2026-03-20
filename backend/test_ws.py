import websocket

ws = websocket.WebSocket()
ws.connect("ws://127.0.0.1:8000/ws")

ws.send("Hello from client 👋")
response = ws.recv()

print("Server response:", response)

ws.close()