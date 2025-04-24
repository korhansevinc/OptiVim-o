'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, UploadCloud } from "lucide-react";

export default function ColorizationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useGpu, setUseGpu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setOutputImage(null);
    }
  };

  const handleColorize = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('use_gpu', useGpu.toString());

    try {
      setIsLoading(true);
      const response = await fetch('/api/colorize-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Colorization failed: ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setOutputImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-neutral-50 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold text-center text-gray-700 tracking-tight">Image Colorization</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Input Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Original Preview" className="w-full h-full object-contain" />
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
              <h2 className="text-xl font-semibold text-indigo-600">Colorized Output</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    <span className="text-gray-500 text-sm mt-2">Colorizing...</span>
                  </div>
                ) : outputImage ? (
                  <img src={outputImage} alt="Colorized Output" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Output Yet</span>
                )}
              </div>

              {outputImage && !isLoading && selectedFile && (
                <a
                  href={outputImage}
                  download={`${selectedFile.name.replace(/\.[^/.]+$/, '')}_colorized.png`}
                >
                  <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="mr-2 w-4 h-4" /> Download Colorized
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Use GPU + Submit */}
        <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={useGpu}
                  onChange={() => setUseGpu(!useGpu)}
                  className="mr-2 accent-indigo-600"
                />
                Use GPU
              </label>
              <Button
                onClick={handleColorize}
                disabled={isLoading || !selectedFile}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Colorizing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 w-4 h-4" /> Colorize Image
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
