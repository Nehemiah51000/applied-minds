import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Categories from './_components/Categories';
import SearchInput from '@/components/SearchInput';
import getCourses from '@/actions/getCourses';
import CoursesList from '@/components/CoursesList';

interface ISearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

async function SearchPage({ searchParams }: ISearchPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const courses = await getCourses({
    userId,
    ...searchParams,
  });
  return (
    <>
      <div className='p-6 md:hidden  md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6'>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;
