'use client';

import { useImageContext } from '../app/utils/ImageContext';
import Image from 'next/image';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ImageEditorComponent() {
  const { image, imageSettings, updateImageSettings } = useImageContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, settings: imageSettings }),
      });
  
      if (!response.ok) throw new Error('Image processing failed');
  
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `processed_image.${imageSettings.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL after download
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Editor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square relative mb-4">
              {image ? (
                <Image
                  src={image}
                  alt="Edited image preview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                  style={{
                    filter: `brightness(${imageSettings.brightness}%) contrast(${imageSettings.contrast}%) saturate(${imageSettings.saturation}%)`,
                    transform: `rotate(${imageSettings.rotation}deg)`
                  }}
                />
              ) : (
                <p className="text-center text-gray-500">No image uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="brightness">Brightness</Label>
                <Slider
                  id="brightness"
                  min={0}
                  max={200}
                  step={1}
                  value={[imageSettings.brightness]}
                  onValueChange={([value]) => updateImageSettings('brightness', value)}
                />
              </div>
              <div>
                <Label htmlFor="contrast">Contrast</Label>
                <Slider
                  id="contrast"
                  min={0}
                  max={200}
                  step={1}
                  value={[imageSettings.contrast]}
                  onValueChange={([value]) => updateImageSettings('contrast', value)}
                />
              </div>
              <div>
                <Label htmlFor="saturation">Saturation</Label>
                <Slider
                  id="saturation"
                  min={0}
                  max={200}
                  step={1}
                  value={[imageSettings.saturation]}
                  onValueChange={([value]) => updateImageSettings('saturation', value)}
                />
              </div>
              <div>
                <Label htmlFor="rotation">Rotation</Label>
                <Slider
                  id="rotation"
                  min={0}
                  max={360}
                  step={1}
                  value={[imageSettings.rotation]}
                  onValueChange={([value]) => updateImageSettings('rotation', value)}
                />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select onValueChange={(value) => updateImageSettings('format', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleDownload} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Download Image'
                )}
              </Button>
              {downloadUrl && (
                <a href={downloadUrl} download className="block text-center mt-4 text-blue-500">
                  Download Processed Image
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
