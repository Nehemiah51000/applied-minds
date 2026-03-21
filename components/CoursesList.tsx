import { Category, Course } from '@/app/generated/prisma';
import CourseCard from './CourseCard';

type TWithProgressWithCategory = Course & {
  chapters: { id: string }[];
  category: Category | null;
  progress: number | null;
};

interface ICoursesListProps {
  items: TWithProgressWithCategory[];
}
function CoursesList({ items }: ICoursesListProps) {
  return (
    <div>
      <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chapterLength={item.chapters.length}
            progress={item.progress!}
            category={item?.category?.name || 'Uncategorized'}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className='text-center text-sm text-muted-foreground'>
          No courses found.
        </div>
      )}
    </div>
  );
}

export default CoursesList;
