from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch 
def main():
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    model.eval()

    image_path = "C:/Users/Korhan/Desktop/workspace/vsCodeWorkspace/optivim-o/python_backend/noise_sample_gaussian_denoised.jpg"
    image = Image.open(image_path).convert('RGB')

    inputs = processor(image, return_tensors="pt")
    with torch.no_grad() :
        out = model.generate(**inputs)

    print("Raw output:", out)

    caption = processor.decode(out[0], skip_special_tokens=True)
    if caption.strip() == "":
        print("⚠️ Boş caption döndü.")
    else:
        print("Generated caption:", caption)

if __name__ == "__main__":
    main()