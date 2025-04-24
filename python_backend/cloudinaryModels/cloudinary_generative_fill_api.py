from flask import Blueprint , request, send_file, jsonify
from pathlib import Path
from dotenv import load_dotenv
import os
import cloudinary
env_path = Path(__file__).resolve().parents[2] / ".env.local"
load_dotenv(dotenv_path=env_path)

cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import io 
import cv2
import numpy as np
import os
import requests
from urllib.parse import quote
from cloudinary import CloudinaryImage
from bs4 import BeautifulSoup
import re

image_generative_fill_bp = Blueprint('image_generative_filler', __name__)



def extract_img_src(html_string):
    match = re.search(r'src="([^"]+)"', html_string)
    return match.group(1) if match else None

def apply_generative_fill(public_id, prompt, height, width):
    try:
        encoded_prompt = quote(prompt.strip('"'))

        image = CloudinaryImage(public_id=public_id)
        
        transformed_url = image.image(
            background=f"gen_fill:{encoded_prompt}",
            height=height,
            width=width,
            crop="pad"
        )

        transformed_url = extract_img_src(transformed_url)

        response = requests.get(transformed_url)
        if response.status_code == 200 :
            return io.BytesIO(response.content)
        else :
            raise Exception(f"Failed to fetch generated image. Status code : {response.status_code}")
    except Exception as e : 
        print("error in apply generative fill function : ", e)
        raise
    


@image_generative_fill_bp.route('/generative-fill', methods=['POST'])
def generative_fill():
    try : 
        file = request.files['image']
        prompt = str(request.form.get('prompt', None))
        height = int(request.form.get('targetHeight', 512))
        width = int(request.form.get('targetWidth', 512))

        if not prompt :
            return jsonify({"error" : "Prompt param is required"}), 400
        if not height :
            return jsonify({"error" : "Prompt param is required"}), 400
        if not width :
            return jsonify({"error" : "Prompt param is required"}), 400
        
        prompt = re.sub(r'[^a-zA-Z0-9ğüşöçİĞÜŞÖÇ\s]', '', prompt)
        prompt = re.sub(r'\s+', ' ', prompt).strip()


        image_bytes = file.read()
        
        upload_result = cloudinary.uploader.upload(image_bytes, categorization="aws_rek_tagging" ,resource_type="image")
        public_id = upload_result.get("public_id")

        generated_image = apply_generative_fill(public_id, prompt, height, width)
        return send_file(generated_image, mimetype='image/jpeg')


    except Exception as e :
        print("Exception at cloudinary generative fill api : ", e)
        return jsonify({'error' : str(e)}), 500