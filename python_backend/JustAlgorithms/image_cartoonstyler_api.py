from flask import Blueprint, request, send_file, jsonify
import cv2
import numpy as np
import io
import os

image_cartoon_styler_bp = Blueprint('image_cartoon_styler', __name__)

def apply_cartoon_style(image, bilateral_d=9, sigma_color=75, sigma_space=75,
                        blur_ksize=7, thresh_block_size=9, thresh_C=2):

    # 1. Downsample + Bilateral Filter + Upsample
    small = cv2.pyrDown(image)
    for _ in range(2):
        small = cv2.bilateralFilter(small, d=bilateral_d, sigmaColor=sigma_color, sigmaSpace=sigma_space)
    filtered = cv2.pyrUp(small)

    # 2. Eğer boyutlar tutmazsa, orijinal görüntü boyutuna getir
    filtered = cv2.resize(filtered, (image.shape[1], image.shape[0]))

    # 3. Kenar bulma
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.medianBlur(gray, blur_ksize)
    edges = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY,
        blockSize=thresh_block_size,
        C=thresh_C
    )
    edges_colored = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    # 4. Kenarları ve filtrelenmiş görüntüyü birleştir
    cartoon = cv2.bitwise_and(filtered, edges_colored)

    return cartoon

@image_cartoon_styler_bp.route('/cartoon-stylizer', methods=['POST'])
def apply_cartoon():
    try:
        file = request.files['image']
        bilateral_d = int(request.form.get('bilateral_d', 9))
        sigma_color = int(request.form.get('sigma_color', 75))
        sigma_space = int(request.form.get('sigma_space', 75))
        blur_ksize = int(request.form.get('blur_ksize', 7))
        thresh_block_size = int(request.form.get('thresh_block_size', 9))
        thresh_C = int(request.form.get('thresh_C', 2))
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()


        if not bilateral_d :
            return jsonify({"error": "Bilateral param is required"}), 400
        if not sigma_color :
            return jsonify({"error": "Sigma color param is required"}), 400
        if not sigma_space :
            return jsonify({"error": "Sigma space param is required"}), 400
        if not blur_ksize : 
            return jsonify({"error": "Blur param is required"}), 400
        if not thresh_block_size : 
            return jsonify({"error": "Threshold Block param is required"}), 400
        if not thresh_C :
            return jsonify({"error": "Threshold param is required"}), 400

        image_bytes = file.read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        cartooned = apply_cartoon_style(image=image, 
                                        bilateral_d=bilateral_d,
                                        sigma_color=sigma_color,
                                        sigma_space=sigma_space,
                                        blur_ksize=blur_ksize,
                                        thresh_block_size=thresh_block_size,
                                        thresh_C=thresh_C)
        
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

        success, buffer = cv2.imencode(selected_ext, cartooned)
        if not success:
            raise ValueError("Encoding failed at contrast enhancer api.")
        
        return send_file(
            io.BytesIO(buffer),
            mimetype=mimetype,
            download_name=f"cartooned{selected_ext}"
        )

    except Exception as e :
        print("Cartoon enhancer error : ", e)
        return jsonify({'error' : str(e)}), 500