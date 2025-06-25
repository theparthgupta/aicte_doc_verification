from fastapi import APIRouter, HTTPException
from ultralytics import YOLO
import torch
import cv2
import numpy as np
import requests


try:
    model = YOLO('D:/Programming/project/sih/git/aicte_models/app/data/best.pt')  # Load pretrained model
    model.to('cuda' if torch.cuda.is_available() else 'cpu')  # Move to GPU if available
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise


def process_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


