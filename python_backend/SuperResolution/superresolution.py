from flask import Blueprint , request, send_file, jsonify
from pathlib import Path
from dotenv import load_dotenv
import os
from PIL import Image
import io
from io import BytesIO
from diffusers import StableDiffusionUpscalePipeline
import torch
from PIL import Image

os.environ["HF_HOME"] = "/mnt/disk/.cache"
env_path = Path(__file__).resolve().parents[2] / ".env.local"
load_dotenv(dotenv_path=env_path)

super_resolution_bp = Blueprint('super_resolution', __name__)
  
def load_model():
    pipeline = StableDiffusionUpscalePipeline.from_pretrained("stabilityai/stable-diffusion-x4-upscaler")
    pipeline = pipeline.to("cpu")
    return pipeline

@super_resolution_bp.route('/superResolution', methods=['POST'])
def superResolution():
    try : 
        file = request.files['image']
        prompt = str(request.form.get('prompt', None))
        if not prompt :
            return jsonify({"error" : "Prompt param is required"}), 400

        image_bytes = file.read()
        low_res_img = Image.open(BytesIO(image_bytes)).convert("RGB").resize((64, 64))                   
        pipeline = load_model()
        generated_image = pipeline(prompt=prompt, image=low_res_img).images[0]
        output_buffer = io.BytesIO()  # Create an in-memory byte buffer
        generated_image.save(output_buffer, format='JPEG', quality=95)  # Save the PIL image into it
        output_buffer.seek(0)  # Reset buffer cursor to the beginning
        return send_file(output_buffer, mimetype='image/jpeg')  # Send the image as HTTP response
        

    except Exception as e :
        print("Exception at super-resolution : ", e)
        return jsonify({'error' : str(e)}), 500
