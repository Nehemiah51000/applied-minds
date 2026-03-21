import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import SearchInput from '@/components/SearchInput';
import Categories from './_components/Categories';
import CoursesWrapper from './_components/CoursesWrapper';

interface ISearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
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

  return (
    <>
      <div className='p-6 md:hidden  md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesWrapper userId={userId} searchParams={searchParams} />
      </div>
    </>
  );
}

export default SearchPage;
