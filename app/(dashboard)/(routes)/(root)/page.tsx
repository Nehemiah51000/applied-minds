import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Clock, CheckCircle } from 'lucide-react';

import { getDashboardCourses } from '@/actions/getDashboardCourses';

import InfoCard from './_component/InfoCard';
import CoursesList from '@/components/CoursesList';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <InfoCard
          icon={Clock}
          label='In progress'
          numberOfItems={coursesInProgress.length}
        />{' '}
        <InfoCard
          icon={CheckCircle}
          label='Completed'
          numberOfItems={completedCourses.length}
          variant='success'
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
