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
import io 
import os
import requests
from urllib.parse import quote
from cloudinary import CloudinaryImage
import re

image_gen_object_removal_bp = Blueprint('image_generative_object_remover', __name__)

def extract_img_src(html_string):
    match = re.search(r'src="([^"]+)"', html_string)
    return match.group(1) if match else None

def apply_object_removal(public_id, object_to_remove):
    try:
        
        encoded_object = quote(object_to_remove.strip('"'))

        
        image = CloudinaryImage(public_id=public_id)

        transformation = f"gen_remove:prompt_({encoded_object})"

        
        transformed_url = image.image(effect=transformation, crop="pad")

        
        transformed_url = extract_img_src(transformed_url)

        
        response = requests.get(transformed_url)
        if response.status_code == 200:
            return io.BytesIO(response.content)
        else:
            raise Exception(f"Failed to fetch generated image. Status code: {response.status_code}")
    except Exception as e:
        print("Error in apply object removal function:", e)
        raise


@image_gen_object_removal_bp.route('/object-removal', methods=['POST'])
def object_removal():
    try:
        file = request.files['image']
        object_to_remove = str(request.form.get('objectToRemove', None))
        
        object_to_remove = re.sub(r'[^a-zA-Z0-9ğüşöçİĞÜŞÖÇ\s]', '', object_to_remove)
        object_to_remove = re.sub(r'\s+', ' ', object_to_remove).strip()


        if not object_to_remove:
            return jsonify({"error": "Object to remove param is required"}), 400


        image_bytes = file.read()

        upload_result = cloudinary.uploader.upload(image_bytes, categorization="aws_rek_tagging")
        public_id = upload_result.get("public_id")

        generated_image = apply_object_removal(public_id, object_to_remove)
        
        return send_file(generated_image, mimetype='image/jpeg')
    
    except Exception as e:
        print("Exception in object removal API: ", e)
        return jsonify({'error': str(e)}), 500