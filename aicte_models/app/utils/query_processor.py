import json
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq

# Initialize Groq client
groq_api_key = "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"
groq_client = Groq(api_key=groq_api_key)

# Load pre-processed data
with open("app/data/handbook_data.json", 'r') as f:
    handbook_data = json.load(f)

# Initialize sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_relevant_chunks(query, top_k=3):
    # Generate query embedding
    query_embedding = model.encode([query])[0]

    # Calculate cosine similarity
    similarities = [np.dot(query_embedding, np.array(item['embedding'])) / 
                    (np.linalg.norm(query_embedding) * np.linalg.norm(np.array(item['embedding'])))
                    for item in handbook_data]

    # Get top-k chunks
    top_indices = np.argsort(similarities)[-top_k:]
    return [handbook_data[i]['chunk'] for i in top_indices]

def generate_response(query, previous_messages=[]):
    relevant_chunks = get_relevant_chunks(query)
    context = "\n".join(relevant_chunks)

    # Prepare the conversation history
    conversation_history = ""
    for msg in previous_messages:
        conversation_history += f"{msg['role'].capitalize()}: {msg['content']}\n"

    prompt = f"""You are an AI assistant for the AICTE handbook. Use the following context and conversation history to answer the user's question.
    If you can't find the answer in the context or conversation history, say you don't know.

    Context from AICTE handbook:
    {context}

    Conversation history:
    {conversation_history}

    User: {query}
    Assistant:"""

    response = groq_client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for the AICTE handbook."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7,
    )

    return response.choices[0].message.content

