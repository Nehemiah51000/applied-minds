import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

import Sidebar from './Sidebar';

function MobileSideBar() {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition '>
        <Menu className='text-slate-500 ' />
      </SheetTrigger>

      <SheetContent side='left' className='p-0 bg-white'>
        <SheetHeader>
          <SheetTitle>Side bar is now in view</SheetTitle>
          <SheetDescription>
            This action shows the sidebar on mobile devices
          </SheetDescription>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

export default MobileSideBar;
