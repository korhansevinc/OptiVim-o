# pixel_art_api.py

from flask import Blueprint, request, jsonify, send_file
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

pixel_art_bp = Blueprint("pixel_art", __name__)

# Load models (global to avoid reloading)
bg_generator = tf.keras.models.load_model('./PixelArt/Model/MB5.keras')
pixelart_generator = tf.keras.models.load_model('./PixelArt/Model/ModelPixelArt.keras')

def generate_images(generator, manual_seed, seed_value, num_images):
    if manual_seed:
        tf.random.set_seed(seed_value)
    noise = tf.random.normal([num_images, 100])
    images = generator(noise, training=False)
    images = (images * 127.5 + 127.5).numpy().astype(np.uint8)
    return images

@pixel_art_bp.route('/generate-pixel-art', methods=['POST'])
def generate_pixel_art():
    try:
        data = request.json
        manual_seed = data.get('manual_seed', False)
        seed_value = int(data.get('seed_value', 42))
        num_images = int(data.get('num_images', 4))
        images = generate_images(pixelart_generator, manual_seed, seed_value, num_images)

        # Convert to base64 strings
        base64_images = []
        for img in images:
            buffer = io.BytesIO()
            Image.fromarray(img).save(buffer, format='PNG')
            base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            base64_images.append(f"data:image/png;base64,{base64_str}")

        return jsonify({"images": base64_images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pixel_art_bp.route('/generate-background', methods=['POST'])
def generate_background():
    try:
        data = request.json
        manual_seed = data.get('manual_seed', False)
        seed_value = int(data.get('seed_value', 42))
        num_images = int(data.get('num_images', 4))
        images = generate_images(bg_generator, manual_seed, seed_value, num_images)

        # Convert each image to base64 string
        base64_images = []
        for img in images:
            buffer = io.BytesIO()
            Image.fromarray(img).save(buffer, format='PNG')
            base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            base64_images.append(f"data:image/png;base64,{base64_str}")

        return jsonify({"images": base64_images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@pixel_art_bp.route('/convert-to-pixel-art', methods=['POST'])
def convert_to_pixel_art():
    try:
        file = request.files['image']
        img = Image.open(file.stream).convert("RGB")
        img = img.resize((32, 32)).resize((256, 256), Image.NEAREST)

        output = io.BytesIO()
        img.save(output, format='PNG')
        output.seek(0)
        return send_file(output, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500
