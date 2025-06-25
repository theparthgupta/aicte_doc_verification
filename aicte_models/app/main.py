from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from app.services.detect.blueprint import calculate_building_area, ImageUrl
from app.utils.pdf_compare_utils import classify_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # e.g., ["GET", "POST", "OPTIONS"]
    allow_headers=["*"],  # e.g., ["Authorization", "Content-Type"]
)

groq_api_key = "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"


@app.get("/")
def read_root():
    return {"message": "Welcome to the app"}


from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect
from app.utils.query_processor import generate_response
from app.utils.index import Query
import json


@app.websocket("/chatbot")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []

    try:
        while True:
            # Receive message from the client
            data = await websocket.receive_text()

            # Process the message
            user_message = {"role": "user", "content": data}
            conversation_history.append(user_message)

            # Generate response
            response = generate_response(user_message["content"], conversation_history)
            assistant_message = {"role": "assistant", "content": response}
            conversation_history.append(assistant_message)

            # Send the response back to the client
            await websocket.send_text(json.dumps(assistant_message))

    except WebSocketDisconnect:
        print("WebSocket disconnected")


import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from groq import Groq
import requests
from io import BytesIO
from PyPDF2 import PdfReader

app = FastAPI()


def extract_text_from_pdf_url(pdf_url):
    try:
        response = requests.get(pdf_url)
        response.raise_for_status()
        pdf_file = BytesIO(response.content)
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        return None


@app.websocket("/chat-pdf")
async def chat_pdf(websocket: WebSocket):
    await websocket.accept()
    client = Groq(api_key=groq_api_key)

    try:
        while True:
            # Receive data from the client
            data = await websocket.receive_text()
            body = json.loads(data)
            user_message = body.get("message", "")
            pdf_url = body.get("pdf_url", "")

            # Extract text from the PDF
            pdf_text = extract_text_from_pdf_url(pdf_url)
            if pdf_text is None:
                await websocket.send_text(
                    json.dumps({"error": "Failed to extract text from PDF"})
                )
                continue

            # Construct the prompt
            prompt = f"""
            You are an AI assistant specialized in analyzing PDF documents.
            PDF Content:
            {pdf_text[:1000]}  # Limiting to first 1000 characters for brevity
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
                )
                print(completion.choices[0].message.content)

                await websocket.send_text(
                    json.dumps({"content": completion.choices[0].message.content})
                )
            except Exception as e:
                logging.error(f"Error in chat: {e}")
                await websocket.send_text(json.dumps({"error": str(e)}))
    except WebSocketDisconnect:
        logging.info("WebSocket connection closed")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")


@app.post("/validate_blueprint")
async def calculate_room_area_from_url(data : ImageUrl):
    """
    Endpoint to calculate the room's outer area from a blueprint image URL.
    Args:
        data (ImageURL): The URL of the blueprint image.
    Returns:
        JSONResponse: The dimensions and area of the room.
    """
    try:
        # Download the image from the provided URL
        dimensions = calculate_building_area(data.url)
        print(dimensions)
        return JSONResponse(
            dimensions
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {e}")


from fastapi import APIRouter, HTTPException
import logging
from app.utils.pdf_compare_utils import check_with_groq, compare_layouts
from app.utils.index import PDFComparisonRequest, download_pdf, ImageComparisionRequest

router = APIRouter()
logging.basicConfig(level=logging.INFO)


@app.post("/chat/comparison")
async def compare_pdfs(request: PDFComparisonRequest):
    try:
        template_path = await download_pdf(request.template_url)
        filled_path = await download_pdf(request.filled_url)
        layouts_similar, placeholder_values, layout_issues = compare_layouts(
            template_path, filled_path
        )
        placeholder_values = check_with_groq(placeholder_values)
        result = {
            "layouts_similar": layouts_similar,
            "placeholder_values": placeholder_values,
        }
        if not layouts_similar:
            result["layout_issues"] = layout_issues
        return result
    except Exception as e:
        logging.error(f"Error processing PDFs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


from app.services.detect.object import model, process_image


@app.post("/detect_institute_image")
async def detect_objects(image_request: ImageComparisionRequest):
    try:
        # Download image from URL
        print(image_request)
        response = requests.get(image_request.url)
        response.raise_for_status()
        img = process_image(response.content)

        # Run inference
        results = model(img)

        # Process results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detection = {
                    "bbox": box.xyxy[0].tolist(),  # Convert bbox to list
                    "confidence": float(box.conf),  # Convert confidence to float
                    "class": int(box.cls),  # Get predicted class
                    "class_name": result.names[int(box.cls)],  # Get class name
                }
                detections.append(detection)

        return {
            "status": "success",
            "detections": detections,
            "model_info": {
                "device": str(next(model.parameters()).device),
                "num_detections": len(detections),
            },
        }

    except requests.RequestException as e:
        raise HTTPException(
            status_code=400, detail=f"Error downloading image: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


