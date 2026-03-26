import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId || !isTeacher(userId)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: { folder?: string } = {};

  try {
    body = await req.json();
  } catch {
    return new NextResponse('Invalid request body', { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
  };

  if (body.folder && typeof body.folder === 'string') {
    const sanitizedFolder = body.folder.replace(/[^a-zA-Z0-9/_-]/g, '');
    if (sanitizedFolder.length > 0) {
      paramsToSign.folder = sanitizedFolder;
    }
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!apiSecret || !cloudName || !apiKey) {
    return new NextResponse('Server configuration error', { status: 500 });
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    timestamp,
    signature,
    folder: paramsToSign.folder ?? undefined,
    cloudName,
    apiKey,
  });
}
