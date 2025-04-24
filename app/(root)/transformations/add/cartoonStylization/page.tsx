'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, UploadCloud, Download } from 'lucide-react';

export default function CartoonEnhancer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [bilateral_d, setBilateralD] = useState(9);
  const [sigma_color, setSigmaColor] = useState(75);
  const [sigma_space, setSigmaSpace] = useState(75);
  const [blur_ksize, setBlurKSize] = useState(7);
  const [thresh_block_size, setThreshBlockSize] = useState(9);
  const [thresh_C, setThreshC] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('bilateral_d', bilateral_d.toString());
    formData.append('sigma_color', sigma_color.toString());
    formData.append('sigma_space', sigma_space.toString());
    formData.append('blur_ksize', blur_ksize.toString());
    formData.append('thresh_block_size', thresh_block_size.toString());
    formData.append('thresh_C', thresh_C.toString());

    try {
      setIsLoading(true);
      setOutputImage(null);

      const response = await fetch('/api/cartoon-stylizer', {
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
        <h1 className="text-5xl font-bold text-center text-gray-700 tracking-tight">Cartoon Stylizer</h1>

        {/* Image Comparison Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Image */}
          <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-indigo-600">Input Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {inputPreview ? (
                  <img src={inputPreview} alt="Input Preview" className="w-full h-full object-contain" />
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
              <h2 className="text-xl font-semibold text-indigo-600">Output Image</h2>
              <div className="w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-white relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    <span className="text-gray-500 text-sm mt-2">Processing...</span>
                  </div>
                ) : outputImage ? (
                  <img src={outputImage} alt="Output" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm">No Output Yet</span>
                )}
              </div>
              {outputImage && selectedFile && (
                <a
                  href={outputImage}
                  download={`${selectedFile.name}_cartoonized.jpg`}
                  className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                >
                  <Download className="w-4 h-4" /> Download Output
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-indigo-600">Adjust Parameters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Bilateral D: {bilateral_d}</Label>
                <Slider min={3} max={15} step={1} value={[bilateral_d]} onValueChange={([v]) => setBilateralD(v)} />
              </div>
              <div>
                <Label>Sigma Color: {sigma_color}</Label>
                <Slider min={50} max={150} step={1} value={[sigma_color]} onValueChange={([v]) => setSigmaColor(v)} />
              </div>
              <div>
                <Label>Sigma Space: {sigma_space}</Label>
                <Slider min={50} max={150} step={1} value={[sigma_space]} onValueChange={([v]) => setSigmaSpace(v)} />
              </div>
              <div>
                <Label>Blur Kernel Size: {blur_ksize}</Label>
                <Slider min={3} max={11} step={2} value={[blur_ksize]} onValueChange={([v]) => setBlurKSize(v)} />
              </div>
              <div>
                <Label>Threshold Block Size: {thresh_block_size}</Label>
                <Slider min={7} max={15} step={2} value={[thresh_block_size]} onValueChange={([v]) => setThreshBlockSize(v)} />
              </div>
              <div>
                <Label>Threshold C: {thresh_C}</Label>
                <Slider min={1} max={10} step={0.1} value={[thresh_C]} onValueChange={([v]) => setThreshC(v)} />
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Transform
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
