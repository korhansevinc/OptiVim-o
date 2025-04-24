from flask import Blueprint, request, send_file, jsonify
import torch
import torch.nn.functional as F
from torchvision.transforms.functional import normalize
from transformers import AutoModelForImageSegmentation
import numpy as np
import io
from PIL import Image
import cv2

background_removal_bp = Blueprint('background_removal', __name__)


def load_model():
    #device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    device = "cpu"
    model = AutoModelForImageSegmentation.from_pretrained("briaai/RMBG-1.4", trust_remote_code=True)
    model.to(device)
    model.eval()
    return model, device

# Preprocess fonksiyonu
def preprocess_image(im: np.ndarray, model_input_size: list) -> torch.Tensor:
    if len(im.shape) < 3:
        im = im[:, :, np.newaxis]
    im_tensor = torch.tensor(im, dtype=torch.float32).permute(2, 0, 1)
    im_tensor = F.interpolate(torch.unsqueeze(im_tensor, 0), size=model_input_size, mode='bilinear')
    image = im_tensor / 255.0
    image = normalize(image, [0.5, 0.5, 0.5], [1.0, 1.0, 1.0])
    return image

# Postprocess fonksiyonu
def postprocess_image(result: torch.Tensor, im_size: list) -> np.ndarray:
    result = torch.squeeze(F.interpolate(result, size=im_size, mode='bilinear'), 0)
    ma = torch.max(result)
    mi = torch.min(result)
    result = (result - mi) / (ma - mi)
    im_array = (result * 255).permute(1, 2, 0).cpu().data.numpy().astype(np.uint8)
    im_array = np.squeeze(im_array)
    return im_array

@background_removal_bp.route('/remove-background', methods=['POST'])
def remove_background_api():
    model, device = load_model()
    try:
        file = request.files['image']
        filename = file.filename

        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image_bgr = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

        orig_im_size = image_rgb.shape[0:2]
        model_input_size = [1024, 1024]

        image = preprocess_image(image_rgb, model_input_size).to(device)

        with torch.no_grad():
            result = model(image)


        result_image = postprocess_image(result[0][0], orig_im_size)

        orig_pil = Image.fromarray(image_rgb)
        alpha = Image.fromarray(result_image)
        orig_pil.putalpha(alpha)

        output = io.BytesIO()
        orig_pil.save(output, format='PNG')
        output.seek(0)

        return send_file(output, mimetype='image/png', download_name='no_background.png')

    except Exception as e:
        print("Background removal error:", e)
        return jsonify({'error': str(e)}), 500
