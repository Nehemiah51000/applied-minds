import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

import { DataTable } from './_components/DataTable';
import { columns } from './_components/columns';

async function CoursesPage() {
  const { userId } = await auth();
  if (!userId) return redirect('/');

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={courses} />
    </div>
  );
}

export default CoursesPage;
