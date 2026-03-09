import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client.js';

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const database = new PrismaClient({ adapter });

async function main() {
  try {
    await database.category.createMany({
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

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database categories', error);
    process.exit(1);
  } finally {
    await database.$disconnect();
  }
}

void main();
