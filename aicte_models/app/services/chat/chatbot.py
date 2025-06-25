from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect
from app.utils.query_processor import generate_response
from app.utils.index import Query
import json

router = APIRouter()

@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []

    try:
        while True:
            # Receive message from the client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Process the message
            user_message = {"role": "user", "content": message.get("message", "")}
            conversation_history.append(user_message)
            
            # Generate response
            response = generate_response(user_message["content"], conversation_history)
            assistant_message = {"role": "assistant", "content": response}
            conversation_history.append(assistant_message)
            
            # Send the response back to the client
            await websocket.send_text(json.dumps(assistant_message))
    
    except WebSocketDisconnect:
        print("WebSocket disconnected")