import { Category, Course } from '@/app/generated/prisma';

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
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

export default CoursesList;
