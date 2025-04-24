from flask import Blueprint, request, send_file, jsonify
import cv2
import numpy as np
import io
import os

image_contrast_enhancer_bp = Blueprint('image_contrast_enhancer', __name__)

def apply_clahe(image, clip_limit, tile_grid_size):
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(tile_grid_size, tile_grid_size))

    if len(image.shape) == 3 and image.shape[2] == 3:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l,a,b = cv2.split(lab)

        l_eq = clahe.apply(l)
        lab_eq = cv2.merge((l_eq, a, b))
        result = cv2.cvtColor(lab_eq, cv2.COLOR_LAB2BGR)
    else :
        result = clahe.apply(image)
    return result



@image_contrast_enhancer_bp.route('/enhance-contrast', methods=['POST'])
def enhance_contrast():
    try:
        file = request.files['image']
        clip_limit = float(request.form.get('clip_limit', 2.0))
        tile_grid_size = int(request.form.get('tile_grid_size', 8 ))
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()

        if not clip_limit :
            return jsonify({"error": "Clip limit is required"}), 400
        
        if not tile_grid_size :
            return jsonify({"error" : "Tile grid size is required"}), 400
        
        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        clahed = apply_clahe(image, clip_limit, tile_grid_size)

        ext_map = {
            '.jpg': '.jpg',
            '.jpeg': '.jpg',
            '.png': '.png',
            '.bmp': '.bmp',
            '.webp': '.webp',
            '.tiff': '.tiff'
        }
        selected_ext = ext_map.get(ext, '.jpg')
        mimetype = f"image/{selected_ext[1:] if selected_ext != '.jpg' else 'jpeg'}"

        success, buffer = cv2.imencode(selected_ext, clahed)
        if not success:
            raise ValueError("Encoding failed at contrast enhancer api.")
        
        return send_file(
            io.BytesIO(buffer),
            mimetype=mimetype,
            download_name=f"clahed{selected_ext}"
        )

    except Exception as e :
        print("Contrast enhancer error : ", e)
        return jsonify({'error': str(e)}), 500