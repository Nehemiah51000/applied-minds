import { ReactNode } from 'react';

import Sidebar from './_components/Sidebar';
import NavBar from './_components/NavBar';

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='h-full'>
      <div className='h-20 md:pl-56 fixed inset-y-0 w-full z-50'>
        <NavBar />
      </div>
      <div className='hidden md:flex h-full w-55 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>

      <main className='md:pl-56 h-full'>{children}</main>
    </div>
  );
}

export default DashboardLayout;
