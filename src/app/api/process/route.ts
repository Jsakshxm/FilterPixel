// pages/api/process.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow large image uploads
    },
  },
};

export async function POST(request: Request) {
  try {
    const { image, settings } = await request.json();

    // Validate input
    if (!image || !settings) {
      return NextResponse.json({ error: 'Invalid input. Image and settings are required.' }, { status: 400 });
    }

    // Decode base64 image
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Process image using Sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .rotate(settings.rotation || 0)
      .modulate({
        brightness: settings.brightness / 100,
        saturation: settings.saturation / 100,
      })
      .toFormat(settings.format)
      .toBuffer();

    // Return the processed image as a blob
    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${settings.format}`,
        'Content-Disposition': `attachment; filename="processed_image.${settings.format}"`,
      },
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
