'use client';

import { useImageContext } from './ImageContext';

export const useImageSettingsController = () => {
  const { imageSettings, updateImageSettings } = useImageContext();

  const changeSetting = (setting: string, value: number | string) => {
    updateImageSettings(setting, value);
  };

  return { imageSettings, changeSetting };
};
