'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ClerkLoaded, UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { Button } from './ui/button';
import SearchInput from './SearchInput';

function NavBarRoutes() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.startsWith('/chapter');
  const isSearchPage = pathname === '/search';

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isPlayerPage ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher mode
            </Button>
          </Link>
        )}
        <ClerkLoaded>
          {typeof window !== 'undefined' && <UserButton afterSignOutUrl='/' />}
        </ClerkLoaded>
      </div>
    </>
  );
}

export default NavBarRoutes;
