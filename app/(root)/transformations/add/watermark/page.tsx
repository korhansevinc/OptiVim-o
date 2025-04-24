'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, UploadCloud } from "lucide-react";

export default function DFTWatermarkPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [spectrumImage, setSpectrumImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setWatermarkedImage(null);
      setSpectrumImage(null);
    }
  };

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkFile(file);
      setWatermarkPreview(URL.createObjectURL(file));
      setWatermarkedImage(null);
      setSpectrumImage(null);
    }
  };

  const embedWatermark = async () => {
    if (!imageFile || !watermarkFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('watermark', watermarkFile);

    try {
      const res = await fetch('/api/watermark-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setWatermarkedImage(json.watermarked_image);
      setSpectrumImage(json.frequency_spectrum);
    } catch (err) {
      console.error(err);
      alert('Embedding failed: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-neutral-50 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold text-center text-gray-700 tracking-tight">DFT Watermark Embedder</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Select Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Input" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Image Selected</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </CardContent>
          </Card>

          {/* Watermark Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Select Watermark</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {watermarkPreview ? (
                  <img src={watermarkPreview} alt="Watermark" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Watermark Selected</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleWatermarkChange} />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-6">
            <Button
              onClick={embedWatermark}
              disabled={!imageFile || !watermarkFile || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Embedding...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 w-4 h-4" /> Embed Watermark
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {(watermarkedImage || spectrumImage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watermarkedImage && (
              <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600">Watermarked Image</h2>
                  <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                    <img src={watermarkedImage} alt="Watermarked" className="w-full h-full object-contain" />
                  </div>
                  <a
                    href={watermarkedImage}
                    download="watermarked.png"
                  >
                    <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="mr-2 w-4 h-4" /> Download
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {spectrumImage && (
              <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600">Frequency Spectrum</h2>
                  <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                    <img src={spectrumImage} alt="Spectrum" className="w-full h-full object-contain" />
                  </div>
                  <a
                    href={spectrumImage}
                    download="frequency_spectrum.png"
                  >
                    <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="mr-2 w-4 h-4" /> Download
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
