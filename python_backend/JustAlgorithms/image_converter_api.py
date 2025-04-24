# image_converter_api.py

from flask import Blueprint, request, send_file, jsonify
from PIL import Image
import io

image_converter_bp = Blueprint('image_converter', __name__)

@image_converter_bp.route('/convert-image', methods=['POST'])
def convert_image():
    try:
        file = request.files['image']
        target_format = request.form['format'].lower()

        supported_formats = ['jpeg', 'jpg', 'png', 'bmp', 'gif', 'tiff', 'webp']
        if target_format not in supported_formats:
            return jsonify({'error': 'Unsupported format'}), 400

        # Pillow'un desteklediği formatlara uygun hale getir
        format_map = {
            'jpg': 'JPEG',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'bmp': 'BMP',
            'gif': 'GIF',
            'tiff': 'TIFF',
            'webp': 'WEBP',
        }
        pil_format = format_map.get(target_format, 'PNG')  # Default: PNG

        image = Image.open(file.stream).convert("RGB")
        output_buffer = io.BytesIO()
        image.save(output_buffer, format=pil_format)
        output_buffer.seek(0)

        mimetype = f"image/{'jpeg' if target_format == 'jpg' else target_format}"
        return send_file(output_buffer, mimetype=mimetype)

    except Exception as e:
        print("Conversion error:", e)
        return jsonify({'error': str(e)}), 500
