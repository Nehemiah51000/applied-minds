import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!isTeacher(userId || undefined)) {
    redirect('/'); // don't return this
  }

  return <>{children}</>;
}
