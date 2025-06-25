import os
import base64
import requests
from groq import Groq
from pydantic import BaseModel

# Initialize Groq client
client = Groq(
    api_key="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",
)

class ImageUrl(BaseModel):
    url:str

def encode_image_from_url(image_url):
    response = requests.get(image_url)
    return base64.b64encode(response.content).decode('utf-8')

def calculate_building_area(image_url):
    # Encode the image
    print(image_url)
    base64_image = encode_image_from_url(image_url)

    # Prepare the prompt
    prompt = f"""
    Analyze the following blueprint image and calculate the outer area of the building:
    [IMAGE]

    Please provide the following information:
    1. A brief description of the building layout
    2. The dimensions of the building (length and width)
    3. The calculated outer area of the building in square meters

    Output Format:
    JSON(
        length(in m),
        width(in m),
        area(in m),
        description
    )
    The url of image is "data:image/jpeg;base64,{base64_image}"
    Respond in a structured format.
    """

    # Make the API call
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt}
                ],
            }
        ],
        model="llama3-8b-8192",
        max_tokens=1000,
        response_format={"type": "json_object"},

    )
    # Extract and return the response
    return chat_completion.choices[0].message.content   