

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';


export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, settings } = body;


    if (!image || !settings) {
      return NextResponse.json({ error: 'Invalid input. Image and settings are required.' }, { status: 400 });
    }


    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Validate format
    const validFormats = ['jpeg', 'png', 'webp', 'tiff'];
    if (!validFormats.includes(settings.format)) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Process image using Sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .modulate({
        brightness: settings.brightness / 100 || 1, 
        saturation: settings.saturation / 100 || 1, 
      })
      .rotate(settings.rotation || 0) 
      .toFormat(settings.format) 
      .toBuffer(); 


    const fileName = `processed-image-${uuidv4()}.${settings.format}`;
    const outputPath = path.join(process.cwd(), 'public', fileName);


    await fs.writeFile(outputPath, processedImageBuffer);


    const imageUrl = `/${fileName}`;
    return NextResponse.json({ url: imageUrl }, { status: 200 });
    
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
