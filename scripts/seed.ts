import 'dotenv/config';
import { Chapter, Course } from '../app/generated/prisma/client.js';
import { db } from '@/lib/db.js';
// import { randomUUID } from 'crypto';

const userId = `${process.env.NEXT_PUBLIC_TEACHER_ID}`;

const courseImages = [
  'https://res.cloudinary.com/dau0znlmo/image/upload/v1774506383/courseImage/qpx9dzekqn4akxnmty6h.jpg',
];

const attachmentLinks = [
  'https://res.cloudinary.com/dau0znlmo/raw/upload/v1774507136/courseAttachment/rku4kbbv7ya1klklrdpy.png',
  'https://res.cloudinary.com/dau0znlmo/raw/upload/v1774507105/courseAttachment/c3gap8mwrcny0nzbyydj.png',
];

async function main() {
  await db.category.createMany({
    data: [
      { name: 'Computer Science' },
      { name: 'Music' },
      { name: 'Fitness' },
      { name: 'Photography' },
      { name: 'Accounting' },
      { name: 'Engineering' },
      { name: 'Filming & Editing' },
    ],
    skipDuplicates: true,
  });

  const allCategories = await db.category.findMany();

  const courses: Course[] = [];
  for (let i = 0; i < 10; i++) {
    const category = allCategories[i % allCategories.length];

    const course = await db.course.create({
      data: {
        title: `Course ${i + 1} - ${category.name}`,
        description: `This is a detailed description for Course ${i + 1} in ${category.name}.`,
        imageUrl: courseImages[0],
        isPublished: true,
        categoryId: category.id,
        userId,
      },
    });

    const numChapters = 8 + Math.floor(Math.random() * 3); // 8–10 chapters
    const chapters: Chapter[] = [];

    for (let j = 0; j < numChapters; j++) {
      const chapter = await db.chapter.create({
        data: {
          title: `Chapter ${j + 1}`,
          description: `Description for Chapter ${j + 1} of ${course.title}`,
          videoUrl:
            'https://res.cloudinary.com/dau0znlmo/video/upload/v1774507680/chapterVideo/ovtrhzlwwtnnajq2gtk4.mp4',
          position: j + 1,
          isPublished: true,
          courseId: course.id,
        },
      });

      await db.muxData.create({
        data: {
          chapterId: chapter.id,
          assetId: 'hUOda7dLqJZNcEi00L8cAIOks8mv5uorfNcpF90000lZMk',
          playbackId: 'AGWZ57DnqT02nOhUqUeInsW01YRXiGRMPEtdjOa6D9r02c',
        },
      });

      chapters.push(chapter);
    }

    const numAttachments = 2 + Math.floor(Math.random() * 3); // 2–4 attachments
    for (let k = 0; k < numAttachments; k++) {
      await db.attachment.create({
        data: {
          name: `Attachment ${k + 1}`,
          url: attachmentLinks[k % attachmentLinks.length],
          courseId: course.id,
        },
      });
    }

    courses.push(course);
  }

  console.log('Database seeded successfully');
}

void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
