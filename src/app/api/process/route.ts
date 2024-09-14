import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs'; // Ensure the Node.js runtime is used

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, settings } = body;

    // Validate input
    if (!image || !settings) {
      return NextResponse.json({ error: 'Invalid input. Image and settings are required.' }, { status: 400 });
    }

    // Decode base64 image
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Validate format
    const validFormats = ['jpeg', 'png', 'webp', 'tiff'];
    if (!validFormats.includes(settings.format)) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Process image using Sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .modulate({
        brightness: settings.brightness / 100 || 1, // Adjust brightness
        saturation: settings.saturation / 100 || 1, // Adjust saturation
      })
      .rotate(settings.rotation || 0) // Rotate image
      .toFormat(settings.format) // Convert to desired format
      .toBuffer(); // Output as buffer

    // Generate a unique file name for the processed image
    const fileName = `processed-image-${uuidv4()}.${settings.format}`;
    const outputPath = path.join(process.cwd(), 'public', fileName);

    // Save processed image to the public directory
    await fs.writeFile(outputPath, processedImageBuffer);

    // Respond with the public URL of the image
    const imageUrl = `/${fileName}`;
    return NextResponse.json({ url: imageUrl }, { status: 200 });
    
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
