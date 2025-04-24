# server.py

from flask import Flask
from flask_cors import CORS

# Blueprint'leri import et
from JustAlgorithms.image_converter_api import image_converter_bp
from JustAlgorithms.image_rotation_api import image_rotation_bp
from JustAlgorithms.image_contrast_enhancer_api import image_contrast_enhancer_bp
from JustAlgorithms.image_cartoonstyler_api import image_cartoon_styler_bp
from DnCNN.noise_removal_api import noise_removal_bp
from cloudinaryModels.cloudinary_generative_fill_api import image_generative_fill_bp
from cloudinaryModels.cloudinary_generative_object_removal_api import image_gen_object_removal_bp
from BlipSummarizer.blip_model_summarizer_api import image_summarizer_bp
from SAM.age_manipulation_api import age_manipulation_bp
from PixelArt.pixel_art_api import pixel_art_bp
from Colorization.colorization_api import colorize_bp
from GFPGAN.image_restoration_api import image_restoration_bp
from BackgroundRemoval.background_removal_api import background_removal_bp
from SuperResolution.superresolution import super_resolution_bp
from watermark.watermark_api import watermark_bp


app = Flask(__name__)
CORS(app)


app.register_blueprint(image_converter_bp)
app.register_blueprint(noise_removal_bp)
app.register_blueprint(image_rotation_bp)
app.register_blueprint(image_contrast_enhancer_bp)
app.register_blueprint(image_cartoon_styler_bp)
app.register_blueprint(image_generative_fill_bp)
app.register_blueprint(image_gen_object_removal_bp)
app.register_blueprint(image_summarizer_bp)
app.register_blueprint(age_manipulation_bp)
app.register_blueprint(pixel_art_bp)
app.register_blueprint(colorize_bp)
app.register_blueprint(image_restoration_bp)
app.register_blueprint(background_removal_bp)
app.register_blueprint(super_resolution_bp)
app.register_blueprint(watermark_bp)

if __name__ == '__main__':
    print("Server başlatılıyor...")
    app.run(host='0.0.0.0', port=8000, debug=False)
