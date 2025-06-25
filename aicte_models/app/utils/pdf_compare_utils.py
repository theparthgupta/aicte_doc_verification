import fitz  # PyMuPDF
import re
import json
from difflib import SequenceMatcher, ndiff
from typing import Dict, List, Tuple, Any
from groq import Groq
from fastapi import  HTTPException
from tempfile import NamedTemporaryFile
import logging

groq_api_key = "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"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def extract_pdf_text(pdf_path):
  try:
    doc = fitz.open(pdf_path)
    pages_content = []
    for page in doc:
        text = page.get_text()
        pages_content.append(text)
    return pages_content
  except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        raise

def normalize_text(text):
    return re.sub(r'\s+|<[^>]+>', '', text)

def split_text_with_placeholders(text):
    parts = re.split(r'(<[^>]+>)', text)
    return [part for part in parts if part]

def find_placeholder_values(template, filled, page):
    placeholder_values = {}
    template_parts = re.split(r'(<[^>]+>)', template)
    filled_parts = []
    current_pos = 0

    for part in template_parts:
        if part.startswith('<') and part.endswith('>'):
            placeholder = part[1:-1]
            if current_pos < len(filled):
                next_fixed_text = next((p for p in template_parts[template_parts.index(part)+1:] if not (p.startswith('<') and p.endswith('>'))), None)

                if next_fixed_text:
                    next_pos = filled.find(next_fixed_text, current_pos)
                    if next_pos != -1:
                        value = filled[current_pos:next_pos].strip()
                    else:
                        value = filled[current_pos:].strip()
                else:
                    value = filled[current_pos:].strip()

                bbox = get_bbox(page, value)
                placeholder_values[placeholder] = {"value": value.split("/n")[0].split(".")[0], "bbox": bbox}
                filled_parts.append(value)
                current_pos = next_pos if next_fixed_text and next_pos != -1 else len(filled)
        else:
            match_pos = filled.find(part, current_pos)
            if match_pos != -1:
                if match_pos > current_pos:
                    filled_parts.append(filled[current_pos:match_pos])
                filled_parts.append(part)
                current_pos = match_pos + len(part)

    if current_pos < len(filled):
        filled_parts.append(filled[current_pos:])

    return placeholder_values, ' '.join(filled_parts)

def get_bbox(page, text):
  try:
    words = page.get_text("words")
    text_words = text.split()
    start_word = text_words[0]
    end_word = text_words[-1]

    start_bbox = None
    end_bbox = None

    for word in words:
        if word[4].startswith(start_word) and start_bbox is None:
            start_bbox = word[:4]
        if word[4].endswith(end_word):
            end_bbox = word[:4]
            break

    if start_bbox and end_bbox:
        return [
            min(start_bbox[0], end_bbox[0]),
            min(start_bbox[1], end_bbox[1]),
            max(start_bbox[2], end_bbox[2]),
            max(start_bbox[3], end_bbox[3])
        ]
    return None
  except:
    return None

def detect_layout_errors(template, filled, page):
    errors = []
    template_lines = template.split('\n')
    filled_lines = filled.split('\n')

    if len(template_lines) != len(filled_lines):
        errors.append({
            "issue": "Line count mismatch",
            "description": f"Template has {len(template_lines)} lines, filled has {len(filled_lines)} lines",
            "location": get_bbox(page, template)
        })

    for i in range(max(len(template_lines), len(filled_lines))):
        template_line = template_lines[i] if i < len(template_lines) else ''
        filled_line = filled_lines[i] if i < len(filled_lines) else ''

        template_parts = split_text_with_placeholders(template_line)
        filled_parts = split_text_with_placeholders(filled_line)

        j = 0
        k = 0
        while j < len(template_parts) and k < len(filled_parts):
            if template_parts[j].startswith('<') and template_parts[j].endswith('>'):
                j += 1
                continue

            if filled_parts[k].startswith('<') and filled_parts[k].endswith('>'):
                k += 1
                continue

            template_part = normalize_text(template_parts[j])
            filled_part = normalize_text(filled_parts[k])

            if template_part != filled_part:
                bbox = get_bbox(page, template_parts[j] or filled_parts[k])
                errors.append({
                    "issue": "Text mismatch",
                    "description": f"Mismatch on line {i + 1}",
                    "template_part": template_parts[j],
                    "filled_part": filled_parts[k],
                    "location": bbox
                })

            j += 1
            k += 1

    return errors

def compare_layouts(pdf1_path, pdf2_path):
  try:
    doc1 = fitz.open(pdf1_path)
    doc2 = fitz.open(pdf2_path)
    
    all_placeholder_values = {}
    layout_issues = []

    if len(doc1) != len(doc2):
        layout_issues.append({
            "issue": "Different number of pages",
            "description": f"PDF1 has {len(doc1)} pages, PDF2 has {len(doc2)} pages",
            "location": "Entire document"
        })
        return False, all_placeholder_values, layout_issues

    for page_num in range(len(doc1)):
        page1 = doc1[page_num]
        page2 = doc2[page_num]
        text1 = page1.get_text()
        text2 = page2.get_text()

        placeholder_values, reconstructed_text = find_placeholder_values(text1, text2, page2)
        all_placeholder_values.update(placeholder_values)

        page_errors = detect_layout_errors(text1, text2, page1)
        for error in page_errors:
            error["page"] = page_num + 1
            layout_issues.append(error)

    doc1.close()
    doc2.close()

    layouts_similar = len(layout_issues) == 0
    return layouts_similar, all_placeholder_values, layout_issues
  except Exception as e:
        logging.error(f"Error comparing layouts: {e}")
        raise

def check_with_groq(placeholder_values):
    client = Groq(api_key=groq_api_key)

    prompt = f"""
Analyze the following placeholder values:

{json.dumps(placeholder_values, indent=2)}

For each placeholder value, perform the following analysis:

1. Ignore the `bbox` key in your evaluation; it's used for other purposes.

2. Evaluate if the value is valid and appropriate for the placeholder name using these criteria:
   a. The value should not be identical to the placeholder name (e.g., "<Name>" is invalid for a <Name> placeholder).
   b. The value should align with the expected information type suggested by the placeholder name.
   c. The value should be realistic and contextually appropriate for Indian documents (e.g., forms, contracts, affidavits, academic records).
   d. The value should not contain placeholder-like terms (e.g., <Field>, [Enter Text Here]) or generic phrases that don't represent actual data.

3. Consider the placeholder names as general indicators of the expected data type, but avoid assuming overly strict formats unless explicitly implied by the name.

4. Be aware of potential variations in Indian naming conventions, address formats, and document-specific terminology.

5. For numerical fields, check if the value is within a reasonable range for the given context (e.g., age, year of birth, pin code).

6. For date fields, verify that the date is in a valid format and represents a plausible date (e.g., not in the future for a birth date).

7. For address fields, check for the presence of key components (e.g., street, city, state) without being overly strict about the exact format.

8. For name fields, allow for variations in Indian naming conventions, including the possibility of single-word names or the use of initials.

Respond with a JSON object containing:
While resonping consider all the above points of prompt
1. `placeholder_analysis`: A dictionary with placeholder names as keys and analysis results as values. Each analysis should include:
   - `is_valid`: A boolean indicating if the value is valid after considering the above criteria (true for valid, false for invalid).
   - `confidence`: A float between 0 and 1 indicating the confidence level of the validity assessment.
   - `issues`: An array of strings describing any identified issues. If the value is valid, this array should be empty.
   - `suggestions`: An array of strings providing potential fixes or improvements for invalid values. If the value is valid, this array should be empty.
Ensure that your analysis is balanced and considers the possibility of valid but unconventional data. If you're unsure about the validity of a value, lean towards marking it as valid with a lower confidence score rather than immediately flagging it as invalid.
    """

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"},
            stop=None,
        )

        groq_analysis = json.loads(completion.choices[0].message.content)

        # Update placeholder values with Groq's analysis
        for placeholder, analysis in groq_analysis["placeholder_analysis"].items():
            if placeholder in placeholder_values:
                placeholder_values[placeholder]["analysis"] = analysis

        # Replace layout issues with improved versions

        return placeholder_values
    except Exception as e:
        logging.error(f"Error finding bounding box: {e}")
        return placeholder_values


import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load pre-trained model and tokenizer
model_name = "nlpaueb/legal-bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def preprocess_text(text):
    # Tokenize and encode the text
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")
    return inputs

def classify_text(text):
    # Preprocess the input text
    inputs = preprocess_text(text)
    
    # Make prediction
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Get the predicted class (0: non-legal, 1: legal)
    predicted_class = torch.argmax(outputs.logits, dim=1).item()
    
    # Get the confidence score
    confidence = torch.softmax(outputs.logits, dim=1)[0][predicted_class].item()
    
    # Return the result
    if predicted_class == 1:
        return True
    else:
        return False


