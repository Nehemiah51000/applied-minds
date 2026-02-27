import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

// Signed upload signature generator for Cloudinary
export async function POST(req: Request) {
  const { folder } = await req.json();

  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
  };

  if (folder && typeof folder === 'string') {
    paramsToSign.folder = folder;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({
    timestamp,
    signature,
    folder: folder ?? undefined,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

