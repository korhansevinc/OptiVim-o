'use client';

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download, UploadCloud } from "lucide-react";

export default function GenerativeFillPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [targetHeight, setHeight] = useState(512);
  const [targetWidth, setWidth] = useState(512);
  const [givenPrompt, setGivenPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('prompt', givenPrompt.toString());
    formData.append('targetHeight', targetHeight.toString());
    formData.append('targetWidth', targetWidth.toString());

    try {
      setIsLoading(true);
      setOutputImage(null);
      const response = await fetch('/api/generative-fill', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setOutputImage(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInputPreview(URL.createObjectURL(file));
      setOutputImage(null);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-neutral-50 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold text-center text-gray-700 tracking-tight">Generative Fill</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Input Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {inputPreview ? (
                  <img
                    src={inputPreview}
                    alt="Input Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image Selected</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </CardContent>
          </Card>

          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Output Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    <span className="text-gray-500 text-sm mt-2">Generating...</span>
                  </div>
                ) : outputImage ? (
                  <img src={outputImage} alt="Output" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Output Yet</span>
                )}
              </div>

              {outputImage && !isLoading && selectedFile && (
                <a
                  href={outputImage}
                  download={`${selectedFile.name}_targetHeight_${targetHeight}_targetWidth_${targetWidth}.jpg`}
                >
                  <Button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Download className="mr-2 w-4 h-4" /> Download Output
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">Text Prompt</Label>
              <textarea
                value={givenPrompt}
                onChange={(e) => setGivenPrompt(e.target.value)}
                placeholder="Describe the given image and contextually complete the unseen part of the image."
                className="w-full p-2 border rounded-md min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-gray-700">Target Width: {targetWidth}</Label>
              <select
                value={targetWidth}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={1024}>1024</option>
                <option value={1080}>1080</option>
                <option value={1440}>1440</option>
                <option value={1920}>1920</option>
                <option value={2560}>2560</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-gray-700">Target Height: {targetHeight}</Label>
              <select
                value={targetHeight}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={1024}>1024</option>
                <option value={1080}>1080</option>
                <option value={1440}>1440</option>
                <option value={1920}>1920</option>
                <option value={2560}>2560</option>
              </select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || givenPrompt.trim() === ""}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><UploadCloud className="mr-2 w-4 h-4" /> Transform</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
