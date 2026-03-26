import 'dotenv/config';
import { db } from '@/lib/db.js';

// We'll use the types directly from the generated client

const userId = `${process.env.NEXT_PUBLIC_TEACHER_ID}`;

// Mapping categories to their specific Cloudinary images
const categoryImageMap: { [key: string]: string } = {
  'Computer Science':
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774506383/courseImage/qpx9dzekqn4akxnmty6h.jpg',
  Music:
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530379/music_uukppz.jpg',
  Fitness:
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530378/fitness_wudnxd.jpg',
  Photography:
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530377/photography_tlsmz1.jpg',
  Accounting:
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530373/finance_j0phhq.jpg',
  Engineering:
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530377/engineering_u9z7rp.jpg',
  'Filming & Editing':
    'https://res.cloudinary.com/dau0znlmo/image/upload/v1774530376/film-and-editing_wyqzba.jpg',
};

const fallbackImage =
  'https://res.cloudinary.com/dau0znlmo/image/upload/v1774506383/courseImage/qpx9dzekqn4akxnmty6h.jpg';

const attachmentLinks = [
  'https://res.cloudinary.com/dau0znlmo/raw/upload/v1774507136/courseAttachment/rku4kbbv7ya1klklrdpy.png',
  'https://res.cloudinary.com/dau0znlmo/raw/upload/v1774507105/courseAttachment/c3gap8mwrcny0nzbyydj.png',
];

async function main() {
  console.log('Seeding categories...');

  const categoryNames = Object.keys(categoryImageMap);

  // Ensure all categories exist
  for (const name of categoryNames) {
    await db.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const allCategories = await db.category.findMany();

  console.log('Seeding courses...');

  for (let i = 0; i < 10; i++) {
    const category = allCategories[i % allCategories.length];

    // Select image based on category name, or use fallback
    const selectedImage = categoryImageMap[category.name] || fallbackImage;

    const course = await db.course.create({
      data: {
        title: `Course ${i + 1} - ${category.name}`,
        description: `This is a detailed description for Course ${i + 1} in ${category.name}.`,
        imageUrl: selectedImage,
        isPublished: true,
        categoryId: category.id,
        userId,
      },
    });

    const numChapters = 8 + Math.floor(Math.random() * 3); // 8–10 chapters

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

      // Mux Data (Hardcoded for seed)
      await db.muxData.create({
        data: {
          chapterId: chapter.id,
          assetId: 'wyj00gaU016hiV6tLxpZcEQzRW8xsX3XZsStqX6pZHyUk',
          playbackId: 'oEczX5PKC00mQhmwmf1mE1u01ps24c01IICpF00wAWW02OnE',
        },
      });
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
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
