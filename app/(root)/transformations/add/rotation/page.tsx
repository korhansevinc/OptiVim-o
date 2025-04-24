'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, RotateCw } from "lucide-react";

export default function ImageRotationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageBlob, setCurrentImageBlob] = useState<Blob | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const rotationOptions = [
    { label: '↪ Rotate Left (90°)', mode: 'rotate_left' },
    { label: '↩ Rotate Right (90°)', mode: 'rotate_right' },
    { label: '🔄 Rotate 180°', mode: 'rotate_180' },
    { label: '🔃 Flip Horizontal', mode: 'flip_horizontal' },
    { label: '🔁 Flip Vertical', mode: 'flip_vertical' },
    { label: '↷ Rotate +45°', mode: 'rotate_custom_45' },
    { label: '↶ Rotate -45°', mode: 'rotate_custom_-45' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setCurrentImageBlob(file);
      setOutputImage(null);
    }
  };

  const rotateImage = async (mode: string) => {
    if (!currentImageBlob) return;

    const formData = new FormData();
    formData.append('image', currentImageBlob);
    formData.append('mode', mode);

    try {
      setIsLoading(true);
      setOutputImage(null);

      const response = await fetch('/api/rotate-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Rotation failed: ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setOutputImage(url);
      setCurrentImageBlob(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-neutral-50 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold text-center text-gray-700 tracking-tight">Image Rotation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Input Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Input Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Image Selected</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </CardContent>
          </Card>

          {/* Output Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Rotated Output</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    <span className="text-gray-500 text-sm mt-2">Rotating...</span>
                  </div>
                ) : outputImage ? (
                  <img src={outputImage} alt="Rotated Output" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Output Yet</span>
                )}
              </div>

              {outputImage && !isLoading && selectedFile && (
                <a
                  href={outputImage}
                  download={`${selectedFile.name.replace(/\.[^/.]+$/, '')}_rotated.${selectedFile.name.split('.').pop()}`}
                >
                  <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                    <Download className="mr-2 w-4 h-4" /> Download Output
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rotation Buttons */}
        <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-indigo-600">Rotate Options</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rotationOptions.map((opt) => (
                <Button
                  key={opt.mode}
                  onClick={() => rotateImage(opt.mode)}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
