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

        try:
            message = json.loads(data)
        except json.JSONDecodeError:
            message = {}

        role = message.get("role", "user")
        user_text = str(message.get("content", "")).strip()

        if role != "user" or not user_text:
            response = {
                "role": "assistant",
                "content": "Please send a valid user message."
            }
            await websocket.send_text(json.dumps(response))
            continue

        response = {
            "role": "assistant",
            "content": f"Echo: {user_text}"
        }

        await websocket.send_text(json.dumps(response))
