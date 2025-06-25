from fastapi import FastAPI, HTTPException
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from skimage.measure import label, regionprops
from matplotlib import pyplot as plt

app = FastAPI()

app.post("/blueprint")
def blueprint(image_path):

# Load pre-trained U-Net model (replace with your custom model)
    model = load_model("unetmodel.h5")

    def preprocess_image(image_path):
        """Preprocess image for the segmentation model."""
        image = cv2.imread(image_path, cv2.IMREAD_COLOR)
        resized = cv2.resize(image, (256, 256))  # Match model input size
        normalized = resized / 255.0  # Normalize
        return resized, normalized

    def segment_building(image):
        """Use the segmentation model to extract building structure."""
        _, normalized = preprocess_image(image)
        prediction = model.predict(np.expand_dims(normalized, axis=0))
        mask = (prediction.squeeze() > 0.5).astype(np.uint8)
        return mask

    def calculate_dimensions_and_area(mask, scale_factor=1.0):
        """
        Calculate the dimensions and area from the segmentation mask.
        scale_factor: Conversion from pixels to meters.
        """
        labeled_mask = label(mask)
        props = regionprops(labeled_mask)
        if not props:
            return None  # No building detected

        # Assuming the largest region corresponds to the building
        building_region = max(props, key=lambda x: x.area)
        min_row, min_col, max_row, max_col = building_region.bbox

        # Dimensions in meters
        length = (max_row - min_row) * scale_factor
        width = (max_col - min_col) * scale_factor
        area = length * width

        return {
            "length": round(length, 2),
            "width": round(width, 2),
            "area": round(area, 2),
            "description": "Detected building layout with clear boundaries."
        }

    def visualize_segmentation(image_path, mask):
        """Visualize the original image and the segmentation mask."""
        original = cv2.imread(image_path, cv2.IMREAD_COLOR)
        plt.figure(figsize=(12, 6))
        plt.subplot(1, 2, 1)
        plt.title("Original Image")
        plt.imshow(cv2.cvtColor(original, cv2.COLOR_BGR2RGB))
        plt.subplot(1, 2, 2)
        plt.title("Segmentation Mask")
        plt.imshow(mask, cmap="gray")
        plt.show()

    # Main Function
    def analyze_blueprint(image_path, scale_factor=0.05):
        """Analyze blueprint and calculate building area."""
        mask = segment_building(image_path)
        result = calculate_dimensions_and_area(mask, scale_factor)
        visualize_segmentation(image_path, mask)
        return result

    # Example Usage
    result = analyze_blueprint(image_path)
    if result:
        return result
    else:
        return HTTPException(500)


import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn

# Placeholder Dataset
class PlaceholderDataset(Dataset):
    def __init__(self, data, tokenizer, max_len):
        self.data = data
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        entry = self.data[index]
        text = entry['text']
        label = entry['label']  # 0 = invalid, 1 = valid
        issues = entry['issues']  # Multi-label issues
        tokens = self.tokenizer(
            text, max_length=self.max_len, padding="max_length", truncation=True, return_tensors="pt"
        )
        return {
            'input_ids': tokens['input_ids'].squeeze(0),
            'attention_mask': tokens['attention_mask'].squeeze(0),
            'label': torch.tensor(label, dtype=torch.float),
            'issues': torch.tensor(issues, dtype=torch.float)
        }

# Placeholder Validator Model
class PlaceholderValidator(nn.Module):
    def __init__(self, model_name, num_labels, num_issues):
        super(PlaceholderValidator, self).__init__()
        self.bert = BertForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)
        self.issue_head = nn.Linear(self.bert.config.hidden_size, num_issues)

    def forward(self, input_ids, attention_mask, labels=None, issues=None):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        logits = outputs.logits
        pooled_output = outputs.hidden_states[-1][:, 0, :]  # [CLS] token representation
        issue_logits = self.issue_head(pooled_output)
        return logits, issue_logits

# Data Preparation
def prepare_data():
    # Synthetic data example
    data = [
        {'text': "name: John, age: 25", 'label': 1, 'issues': [0, 0, 0]},
        {'text': "name: , age: invalid", 'label': 0, 'issues': [1, 1, 0]},  # Missing name, invalid age
    ]
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    dataset = PlaceholderDataset(data, tokenizer, max_len=128)
    return DataLoader(dataset, batch_size=4)

# Training Loop
def train_model():
    model = PlaceholderValidator("bert-base-uncased", num_labels=1, num_issues=3)
    optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
    loss_fn = nn.BCEWithLogitsLoss()  # Binary classification loss for validity
    issue_loss_fn = nn.BCEWithLogitsLoss()  # Multi-label classification loss for issues

    dataloader = prepare_data()

    model.train()
    for epoch in range(3):
        for batch in dataloader:
            optimizer.zero_grad()

            logits, issue_logits = model(
                batch['input_ids'], batch['attention_mask'], labels=batch['label'], issues=batch['issues']
            )
            loss = loss_fn(logits, batch['label'])
            issue_loss = issue_loss_fn(issue_logits, batch['issues'])
            total_loss = loss + issue_loss

            total_loss.backward()
            optimizer.step()
            print(f"Epoch {epoch}, Loss: {total_loss.item()}")

# Prediction
@app.post("/placeholder")
def predict_placeholder(model, tokenizer, placeholder):
    tokens = tokenizer(placeholder, max_length=128, truncation=True, padding="max_length", return_tensors="pt")
    input_ids = tokens['input_ids']
    attention_mask = tokens['attention_mask']

    model.eval()
    with torch.no_grad():
        logits, issue_logits = model(input_ids, attention_mask)
        is_valid = torch.sigmoid(logits).item() > 0.5
        issues = torch.sigmoid(issue_logits).tolist()

    return {
        'is_valid': is_valid,
        'issues': issues
    }

import json
import torch
import numpy as np
from gensim.models import KeyedVectors
from sklearn.metrics.pairwise import cosine_similarity
from torch import nn
from torch.utils.data import DataLoader, Dataset

# Load GloVe or Word2Vec embeddings (pre-trained)
embedding_model = KeyedVectors.load_word2vec_format('path_to_pretrained_embeddings.bin', binary=True)

# Load AICTE Handbook data
with open("app/data/handbook_data.json", 'r') as f:
    handbook_data = json.load(f)

# Class for BiRNN model for text classification
class BiRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(BiRNN, self).__init__()
        self.rnn = nn.LSTM(input_size, hidden_size, bidirectional=True, batch_first=True)
        self.fc = nn.Linear(2 * hidden_size, output_size)  # Bidirectional gives 2 * hidden_size
    
    def forward(self, x):
        out, _ = self.rnn(x)
        out = out[:, -1, :]  # Taking the output of the last time step
        out = self.fc(out)
        return out

# Generate word embeddings for a sentence using GloVe or Word2Vec
def sentence_to_embedding(sentence):
    words = sentence.split()
    word_embeddings = np.zeros((len(words), 300))  # Assuming 300-dimensional embeddings
    for i, word in enumerate(words):
        if word in embedding_model:
            word_embeddings[i] = embedding_model[word]
    return np.mean(word_embeddings, axis=0)

# Retrieve relevant chunks from the handbook using cosine similarity
def get_relevant_chunks(query, top_k=3):
    query_embedding = sentence_to_embedding(query)
    similarities = []

    for item in handbook_data:
        chunk_embedding = np.array(item['embedding'])  # Assuming chunk embeddings are pre-generated
        similarity = cosine_similarity([query_embedding], [chunk_embedding])[0][0]
        similarities.append(similarity)
    
    # Get top-k most similar chunks
    top_indices = np.argsort(similarities)[-top_k:]
    return [handbook_data[i]['chunk'] for i in top_indices]

# Create dataset for training the model (simple dataset)
class ResponseDataset(Dataset):
    def __init__(self, queries, responses):
        self.queries = queries
        self.responses = responses

    def __len__(self):
        return len(self.queries)

    def __getitem__(self, idx):
        query = sentence_to_embedding(self.queries[idx])
        response = sentence_to_embedding(self.responses[idx])
        return torch.tensor(query, dtype=torch.float32), torch.tensor(response, dtype=torch.float32)

# Train the BiRNN model for response generation (or classification)
def train_model(queries, responses, input_size=300, hidden_size=128, output_size=300):
    model = BiRNN(input_size, hidden_size, output_size)
    dataset = ResponseDataset(queries, responses)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    # Train for a few epochs
    for epoch in range(5):
        for query, response in dataloader:
            optimizer.zero_grad()
            output = model(query)
            loss = criterion(output, response)
            loss.backward()
            optimizer.step()
            print(f"Epoch [{epoch+1}/5], Loss: {loss.item()}")
    
    return model

@app.post("/chatbot")
def generate_response(query, previous_messages=[]):
    relevant_chunks = get_relevant_chunks(query)
    context = "\n".join(relevant_chunks)

    # Use trained BiRNN model to generate a response (simple response generation here)
    response = context  # In a real-world scenario, use the BiRNN model for response
    return response


