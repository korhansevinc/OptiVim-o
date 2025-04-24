# noise_removal_api.py

from flask import Blueprint, request, send_file, jsonify
import cv2
import numpy as np
import torch
from DnCNN.models import DnCNN
import os
import io
from PIL import Image

noise_removal_bp = Blueprint('noise_removal', __name__)

# Modeli yükle
model = DnCNN(channels=1)
state_dict = torch.load('./DnCNN/logs/DnCNN-S-25/net.pth', map_location='cpu')
state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
model.load_state_dict(state_dict)
model.eval()

# Yardımcı fonksiyon: Renkli görsellerde Y kanalı denoise

def denoise_image_color_preserve(image: np.ndarray):
    ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(ycrcb)

    y_norm = y.astype(np.float32) / 255.0
    y_tensor = torch.from_numpy(y_norm).unsqueeze(0).unsqueeze(0).float()

    with torch.no_grad():
        noise = model(y_tensor)
        out = y_tensor - noise
        out = torch.clamp(out, 0.0, 1.0).squeeze().numpy()

    y_denoised = (out * 255).astype(np.uint8)
    merged = cv2.merge([y_denoised, cr, cb])
    final = cv2.cvtColor(merged, cv2.COLOR_YCrCb2BGR)
    return final

@noise_removal_bp.route('/denoise-image', methods=['POST'])
def denoise_image_api():
    try:
        file = request.files['image']
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()

        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        denoised = denoise_image_color_preserve(image)

        # Encode according to input extension
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

        success, buffer = cv2.imencode(selected_ext, denoised)
        if not success:
            raise ValueError("Encoding failed.")

        return send_file(
            io.BytesIO(buffer),
            mimetype=mimetype,
            download_name=f"denoised{selected_ext}"
        )

    except Exception as e:
        print("Denoise error:", e)
        return jsonify({'error': str(e)}), 500
