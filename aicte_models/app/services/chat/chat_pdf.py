from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from groq import Groq
import logging
import json

router = APIRouter()
logging.basicConfig(level=logging.INFO)

groq_api_key = "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"

@router.websocket("/ws")
async def chat_pdf(websocket: WebSocket):
    await websocket.accept()
    client = Groq(api_key=groq_api_key)

    try:
        while True:
            # Receive data from the client
            data = await websocket.receive_text()
            body = json.loads(data)
            user_message = body.get("message", "")
            pdf_data = body.get("pdf_data", {})

            # Construct the prompt
            prompt = f"""
            You are an AI assistant specialized in analyzing PDF documents.
            PDF Data:
            {json.dumps(pdf_data, indent=2)}
            User Question: {user_message}
            """

            # Stream the response to the client
            try:
                completion = client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=1024,
                    top_p=1,
                    stream=True
                )
                async for chunk in completion:
                    if chunk.choices[0].delta.content is not None:
                        await websocket.send_text(json.dumps({"content": chunk.choices[0].delta.content}))
            except Exception as e:
                logging.error(f"Error in chat: {e}")
                await websocket.send_text(json.dumps({"error": str(e)}))
    except WebSocketDisconnect:
        logging.info("WebSocket connection closed")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
