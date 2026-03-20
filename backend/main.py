import json
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        data = await websocket.receive_text()
        message = json.loads(data)

        user_text = message.get("content", "")

        response = {
            "role": "assistant",
            "content": f"Echo: {user_text}"
        }

        await websocket.send_text(json.dumps(response))