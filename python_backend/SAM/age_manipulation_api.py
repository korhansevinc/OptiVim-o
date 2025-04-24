# age_manipulation_api.py

from flask import Blueprint, request, send_file, jsonify
import io
import os
import traceback
from PIL import Image
import torch
from argparse import Namespace
import torchvision.transforms as transforms
import numpy as np
from SAM.models.psp import pSp
from SAM.datasets.augmentations import AgeTransformer
from SAM.utils.common import tensor2im
from SAM.scripts.align_all_parallel import align_face
import dlib
import uuid
import os

age_manipulation_bp = Blueprint('age_manipulation', __name__)

def load_model():
    # 📦 Model yükleme
    EXPERIMENT_TYPE = 'ffhq_aging'
    MODEL_PATH = './SAM/pretrained_models/sam_ffhq_aging.pt'
    ckpt = torch.load(MODEL_PATH, map_location='cpu')
    opts = ckpt['opts']
    opts['checkpoint_path'] = MODEL_PATH
    opts['device'] = 'cpu'
    opts = Namespace(**opts)

    #device = 'cuda' if torch.cuda.is_available() else 'cpu'
    net = pSp(opts).to('cpu').eval()

    # 📍 Face alignment için predictor
    predictor_path = './SAM/pretrained_models/shape_predictor_68_face_landmarks.dat'
    if not os.path.exists(predictor_path):
        raise FileNotFoundError("shape_predictor_68_face_landmarks.dat eksik.")
    predictor = dlib.shape_predictor(predictor_path)
    return predictor, net

@age_manipulation_bp.route('/age-manipulation', methods=['POST'])
def age_manipulation():
    predictor, net = load_model()
    try:
        file = request.files['image']
        target_age = int(request.form['target_age'])

        original_image = Image.open(file.stream).convert("RGB")
        filename = f"{uuid.uuid4().hex}.jpg"
        save_dir = "ageManipulationTempImages"
        os.makedirs(save_dir, exist_ok=True)
        image_path = os.path.join(save_dir, filename)
        original_image.save(image_path, format="JPEG")

        aligned_image = align_face(filepath=image_path, predictor=predictor)

        img_transforms = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize([0.5]*3, [0.5]*3)
        ])
        input_image = img_transforms(aligned_image)

        age_transformer = AgeTransformer(target_age=target_age)
        input_image_age = [age_transformer(input_image.cpu()).to('cpu')]
        input_image_age = torch.stack(input_image_age)

        with torch.no_grad():
            result_tensor = net(input_image_age.float(), randomize_noise=False, resize=False)[0]
            result_image = tensor2im(result_tensor)

        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        return send_file(output_buffer, mimetype='image/jpeg')

    except Exception as e:
        print("Hata:", str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
