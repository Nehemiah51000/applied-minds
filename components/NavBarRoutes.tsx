'use client';

import { UserButton } from '@clerk/nextjs';

function NavBarRoutes() {
  return (
    <div className='flex gap-x-2 ml-auto'>
      <UserButton />
    </div>
  );
}

export default NavBarRoutes;
