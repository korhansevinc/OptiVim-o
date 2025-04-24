# image_rotation_api.py

from flask import Blueprint, request, send_file, jsonify
import cv2
import numpy as np
import io
import os

image_rotation_bp = Blueprint('image_rotation', __name__)

# Mapping of rotation types to OpenCV operations
def apply_rotation(image: np.ndarray, mode: str):
    if mode == 'rotate_right':  # 90 degrees clockwise
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif mode == 'rotate_left':  # 90 degrees counter-clockwise
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    elif mode == 'rotate_180':
        return cv2.rotate(image, cv2.ROTATE_180)
    elif mode == 'flip_horizontal':
        return cv2.flip(image, 1)
    elif mode == 'flip_vertical':
        return cv2.flip(image, 0)
    elif mode.startswith('rotate_custom_'):
        angle = int(mode.replace('rotate_custom_', ''))
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_LINEAR)
    else:
        raise ValueError(f"Unsupported rotation mode: {mode}")

@image_rotation_bp.route('/rotate-image', methods=['POST'])
def rotate_image():
    try:
        file = request.files['image']
        mode = request.form.get('mode')
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()

        if not mode:
            return jsonify({"error": "Rotation mode is required."}), 400

        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        rotated = apply_rotation(image, mode)

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

        success, buffer = cv2.imencode(selected_ext, rotated)
        if not success:
            raise ValueError("Encoding failed.")

        return send_file(
            io.BytesIO(buffer),
            mimetype=mimetype,
            download_name=f"rotated{selected_ext}"
        )

    except Exception as e:
        print("Rotation error:", e)
        return jsonify({'error': str(e)}), 500