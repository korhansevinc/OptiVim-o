'use client';

import { useState } from 'react';
import { Loader2, Download, Image as ImageIcon, UploadCloud } from 'lucide-react';

export default function PixelArtConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOutputUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const res = await fetch('/api/convert-to-pixel-art', {
        method: 'POST',
        body: formData,
      });
      const blob = await res.blob();
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-8 max-w-2xl w-full flex flex-col items-center gap-6 transition-all">
        <h1 className="text-4xl font-bold text-gray-700 tracking-tight">🎨 Pixel Art Converter</h1>

        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 shadow-sm px-5 py-3 rounded-lg hover:bg-gray-100 transition">
          <UploadCloud className="w-5 h-5 text-gray-700" />
          <span className="text-gray-700 font-medium">Select Image</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <button
          onClick={handleConvert}
          disabled={loading || !selectedFile}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              Convert to Pixel Art
            </>
          )}
        </button>

        <div className="flex flex-wrap justify-center gap-10 mt-8 w-full">
          {previewUrl && (
            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 w-72">
              <h2 className="font-semibold text-gray-700 mb-3">Input Image</h2>
              <img src={previewUrl} className="w-full h-64 object-contain rounded border" />
            </div>
          )}

          {outputUrl && (
            <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 w-72">
              <h2 className="font-semibold text-gray-700 mb-3">Pixelated Output</h2>
              <img src={outputUrl} className="w-full h-64 object-contain rounded border mb-3" />
              <a
                href={outputUrl}
                download={`${selectedFile?.name.replace(/\.[^/.]+$/, '')}_pixelart.png`}
                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                <Download className="w-4 h-4" />
                Download Output
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
