'use client';

import { useImageContext } from './ImageContext';

export const useImageController = () => {
  const { image, setImage } = useImageContext();

  const uploadImage = (file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return { image, uploadImage };
};
