import { Attachment, Chapter } from '@/app/generated/prisma';
import { db } from '@/lib/db';

interface IGetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export async function getChapter({
  userId,
  courseId,
  chapterId,
}: IGetChapterProps) {
  try {
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error('Chapter or Course not found');
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    attachments = await db.attachment.findMany({
      where: {
        courseId,
      },
    });

    muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });

    nextChapter = await db.chapter.findFirst({
      where: {
        courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      userProgress,
      nextChapter,
      muxData,
      attachments,
    };
  } catch (error) {
    console.log('[GET_CHAPTER]', error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
    };
  }
}
