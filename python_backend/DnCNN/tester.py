import torch
import torch.nn as nn
import numpy as np
import cv2
import os
from models import DnCNN

# Tekli dosya adını oluştur (_denoised ekleyerek)
def get_denoised_filename(input_path, out_dir):
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    ext = os.path.splitext(input_path)[1]
    return os.path.join(out_dir, f"{base_name}_denoised{ext}")

# Modeli yükle
def load_model():
    model = DnCNN(channels=1)
    state_dict = torch.load('logs/DnCNN-S-25/net.pth', map_location='cpu')

    # Eğer checkpoint içinde "module." varsa onu kaldır
    new_state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
    model.load_state_dict(new_state_dict)
    model.eval()
    return model

# Tek bir görsel için renkli denoise işlemi (Y kanalına)
def dncnn_denoise_color_preserve(image_path, output_path, model):
    color = cv2.imread(image_path)
    ycrcb = cv2.cvtColor(color, cv2.COLOR_BGR2YCrCb)
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

    cv2.imwrite(output_path, final)
    print(f"[✔] {os.path.basename(image_path)} -> {os.path.basename(output_path)}")

# Tüm klasörü işle
def batch_denoise_folder(input_dir="test_samples", output_dir="test_samples_denoised"):
    os.makedirs(output_dir, exist_ok=True)
    model = load_model()

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".jpg"):
            input_path = os.path.join(input_dir, filename)
            output_path = get_denoised_filename(input_path, output_dir)
            dncnn_denoise_color_preserve(input_path, output_path, model)

# Çalıştır
if __name__ == "__main__":
    batch_denoise_folder()
