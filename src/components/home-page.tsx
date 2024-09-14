'use client';

import { useImageContext } from '../app/utils/ImageContext';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

export function HomePageComponent() {
  const { image, setImage } = useImageContext();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Processing App</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent>
          {!image ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
              <p className="mt-1 text-xs text-gray-500">(PNG or JPEG only)</p>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileInput}
              />
            </div>
          ) : (
            <div className="text-center">
              <Image src={image} alt="Uploaded image" width={400} height={300} className="mx-auto mb-4" />
              <Button onClick={() => setImage(null)}>Remove Image</Button>
              <Button className="ml-2">Edit Image</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
