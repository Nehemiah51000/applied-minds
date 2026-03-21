'use  client';

import qs from 'query-string';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

function SearchInput() {
  const [value, setValue] = useState('');
  const searchParams = useSearchParams();
  const debouncedValue = useDebounce(value);
  const pathname = usePathname();
  const router = useRouter();

  const currentCategoryId = searchParams.get('categoryId');
  console.log(currentCategoryId);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );
    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className='relative'>
      <Search className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Search for a course'
        className='w-full md:w-75 pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
      />
    </div>
  );
}

export default SearchInput;
