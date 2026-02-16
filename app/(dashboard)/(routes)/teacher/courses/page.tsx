import Link from 'next/link';

import { Button } from '@/components/ui/button';

function CoursesPage() {
  return (
    <div>
      <Link href='/teacher/create'>
        <Button>New Course</Button>
      </Link>
    </div>
  );
}

export default CoursesPage;
