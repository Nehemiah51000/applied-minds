import { ReactNode } from 'react';

import Sidebar from './_components/Sidebar';

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-55 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>

      <main className='md:pl-56 h-full'>{children}</main>
    </div>
  );
}

export default DashboardLayout;
