from flask import Blueprint , request, send_file, jsonify
from pathlib import Path
from dotenv import load_dotenv
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch 
import os
import io 
import cv2
import numpy as np
import os
import requests
from urllib.parse import quote
from cloudinary import CloudinaryImage
import re
from PIL import Image

image_summarizer_bp = Blueprint('image_summarizer', __name__)

def apply_image_summarizer(image):
    
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    model.eval()
    inputs = processor(image, return_tensors="pt")

    with torch.no_grad():
        out = model.generate(**inputs)

    print("Raw output for debug : ", out)
    caption = processor.decode(out[0], skip_special_tokens=True)
    if caption.strip() == "":
        print("Empty caption.")
        return jsonify({"error" : "Empty caption generated from blip model api."}), 400
    else:
        print("Generated caption:", caption)

    return str(caption).strip()

@image_summarizer_bp.route('/image-summarization', methods=['POST'])
def image_summarizer():
    try:
        file = request.files['image']

        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(image)
        summary = apply_image_summarizer(image_pil)

        if not summary :
            return jsonify({"error" : "Empty caption generated from model."}),400
        
        return jsonify({"caption": summary}), 200

    except Exception as e : 
        print("error at Image summarizing api : ", e)
        return jsonify({"error": str(e)}), 500
