import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized access', { status: 401 });
    }

    console.log(userId, title);

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES-POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
