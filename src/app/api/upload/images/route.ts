import { NextResponse } from 'next/server';
import cloudinary, { CloudinaryUploadResult } from '@/lib/cloudinary';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'images',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else if (!result) reject(new Error('Upload result is undefined'));
          else resolve(result);
        }
      );

      uploadStream.end(Buffer.from(buffer));
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}