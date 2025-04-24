'use client';

import { useState } from 'react';

export default function BackgroundGeneratorPage() {
  const [numImages, setNumImages] = useState(4);
  const [manualSeed, setManualSeed] = useState(false);
  const [seed, setSeed] = useState(42);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setImages([]);

    const res = await fetch('/api/generate-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manual_seed: manualSeed, seed_value: seed, num_images: numImages }),
    });

    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-700 tracking-tight">Pixel Art Background Generator</h1>

      <div className="flex flex-row items-center gap-4 mb-4">
        <label className="font-medium">Number of Images:</label>
        <input
          type="range"
          min={1}
          max={16}
          value={numImages}
          onChange={(e) => setNumImages(Number(e.target.value))}
        />
        <span>{numImages}</span>
      </div>

      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={manualSeed}
            onChange={(e) => setManualSeed(e.target.checked)}
          />
          <span className="ml-2">Use Seed</span>
        </label>
        {manualSeed && (
          <input
            type="number"
            className="ml-4 border px-2 py-1 rounded"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
          />
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {images.map((img, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img src={img} alt={`Generated ${idx}`} className="w-48 h-48 object-contain border mb-2" />
            <a
              href={img}
              download={`background_${idx}.png`}
              className="text-blue-600 hover:underline"
            >
              Download Output
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
