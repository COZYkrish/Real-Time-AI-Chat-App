from fastapi import FastAPI, WebSocket
import requests

app = FastAPI()

def get_ai_response(message: str):
    url = "http://localhost:11434/api/generate"

    payload = {
        "model": "llama3",
        "prompt": message,
        "stream": False
    }

    response = requests.post(url, json=payload)
    data = response.json()

    return data.get("response", "No response from AI")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    while True:
        data = await websocket.receive_json()
        user_message = data["content"]

        print("User:", user_message)

        ai_reply = get_ai_response(user_message)

        await websocket.send_json({
            "role": "assistant",
            "content": ai_reply
        })