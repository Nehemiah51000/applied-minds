import { db } from '@/lib/db';
import Categories from './_components/Categories';
import SearchInput from '@/components/SearchInput';

async function SearchPage() {
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
      <div className='p-6'>
        <Categories items={categories} />
      </div>
    </>
  );
}

export default SearchPage;
