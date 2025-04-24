import argparse
import matplotlib.pyplot as plt
import os
from colorizers import *

# This script performs automatic colorization of grayscale images using two pre-trained models: 
# ECCV16 and SIGGRAPH17. The user can provide the input image path via the `-i` or `--img_path`
# argument and optionally specify whether to use GPU with the `--use_gpu` flag.
# The output will be saved as colorized images with suffixes `_eccv16.png` and `_siggraph17.png` in the
# `imgs_out/` directory, using the base name of the input image for file naming.
#
# Usage:
# 1. Place the grayscale input image in the appropriate directory (default: `imgs/`).
# 2. Run the script with arguments, e.g.,
#    python script_name.py -i imgs/your_image.jpg --use_gpu
# 3. The colorized images will be saved in the `imgs_out/` directory.

parser = argparse.ArgumentParser()
parser.add_argument('-i','--img_path', type=str, default='imgs\\ansel_adams.jpg')
parser.add_argument('--use_gpu', action='store_true', help='whether to use GPU')
parser.add_argument('-o','--os.path.splitext(os.path.basename(file_path))[0]', type=str, default='saved', help='will save into this file with {eccv16.png, siggraph17.png} suffixes')
opt = parser.parse_args()

opt.save_prefix = os.path.splitext(os.path.basename(opt.img_path))[0]

# load colorizers
colorizer_eccv16 = eccv16(pretrained=True).eval()
colorizer_siggraph17 = siggraph17(pretrained=True).eval()
colorizer_eccv16.cuda()
colorizer_siggraph17.cuda()

# default size to process images is 256x256
# grab L channel in both original ("orig") and resized ("rs") resolutions
img = load_img(opt.img_path)
(tens_l_orig, tens_l_rs) = preprocess_img(img, HW=(256,256))
tens_l_rs = tens_l_rs.cuda()

# colorizer outputs 256x256 ab map
# resize and concatenate to original L channel
img_bw = postprocess_tens(tens_l_orig, torch.cat((0*tens_l_orig,0*tens_l_orig),dim=1))
out_img_eccv16 = postprocess_tens(tens_l_orig, colorizer_eccv16(tens_l_rs).cpu())
out_img_siggraph17 = postprocess_tens(tens_l_orig, colorizer_siggraph17(tens_l_rs).cpu())

plt.imsave('imgs_out/%s_eccv16.png'%opt.save_prefix, out_img_eccv16)
plt.imsave('imgs_out/%s_siggraph17.png'%opt.save_prefix, out_img_siggraph17)
