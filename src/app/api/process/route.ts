import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { image, settings } = await req.json();

    if (!image || !settings) {
      return NextResponse.json({ error: 'Invalid input. Image and settings are required.' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    const validFormats = ['jpeg', 'png', 'webp', 'tiff'];
    if (!validFormats.includes(settings.format)) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const processedImageBuffer = await sharp(imageBuffer)
      .modulate({
        brightness: settings.brightness / 100 || 1,
        saturation: settings.saturation / 100 || 1,
      })
      .rotate(settings.rotation || 0)
      .toFormat(settings.format)
      .toBuffer();

    // Return the processed image directly as a blob
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
