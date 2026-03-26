import { redirect } from 'next/navigation';
import { getAnalytics } from '@/actions/getAnalytics';
import { auth } from '@clerk/nextjs/server';

import DataCard from './_components/DataCard';
import Chart from './_components/Chart';

async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }
  const { totalEnrollments, totalCompletedCourses, topCourses } =
    await getAnalytics(userId);
  return (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <DataCard
          value={totalEnrollments}
          label='Total Enrollments'
          dataType='Enrollment'
        />
        <DataCard
          value={totalCompletedCourses}
          label='Total Courses Completed by students'
          dataType='Course'
        />
      </div>
      <Chart data={topCourses} />
    </div>
  );
}

export default AnalyticsPage;
