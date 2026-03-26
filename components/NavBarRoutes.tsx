'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ClerkLoaded, useAuth, UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { Button } from './ui/button';
import SearchInput from './SearchInput';
import { isTeacher } from '@/lib/teacher';

function NavBarRoutes() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.startsWith('/courses');
  const isSearchPage = pathname === '/search';

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId || undefined) ? (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <ClerkLoaded>
          {typeof window !== 'undefined' && <UserButton afterSignOutUrl='/' />}
        </ClerkLoaded>
      </div>
    </>
  );
}

export default NavBarRoutes;
