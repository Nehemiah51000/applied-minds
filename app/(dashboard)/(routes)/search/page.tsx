import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import SearchInput from '@/components/SearchInput';
import Categories from './_components/Categories';
import CoursesWrapper from './_components/CoursesWrapper';

interface ISearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
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

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <div className='p-6 md:hidden md:mb-0 block'>
        <Suspense
          fallback={
            <div className='h-10 w-full bg-slate-100 animate-pulse rounded-md' />
          }>
          <SearchInput />
        </Suspense>
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesWrapper userId={userId} searchParams={resolvedSearchParams} />
      </div>
    </>
  );
}

export default SearchPage;
