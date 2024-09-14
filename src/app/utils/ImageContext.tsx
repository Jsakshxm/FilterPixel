'use client';

import React, { createContext, useContext, useState } from 'react';

interface ImageContextType {
  image: string | null;
  setImage: (image: string | null) => void;
  imageSettings: {
    brightness: number;
    contrast: number;
    saturation: number;
    rotation: number;
    format: string;
  };
  updateImageSettings: (setting: string, value: number | string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    format: 'png',
  });

  const updateImageSettings = (setting: string, value: number | string) => {
    setImageSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <ImageContext.Provider value={{ image, setImage, imageSettings, updateImageSettings }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};
