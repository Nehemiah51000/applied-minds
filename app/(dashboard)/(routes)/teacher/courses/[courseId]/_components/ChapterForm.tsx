'use client';

import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Course, Chapter } from '@/app/generated/prisma/client';
import ChapterList from './ChapterList';

interface IChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

function ChapterForm({ initialData, courseId }: IChapterFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);

      toast.success('Chapter updated successfully');
      toggleCreating();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to update chapter. Please try again!');
    }
  };

  async function handleReorder(updateData: { id: string; position: number }[]) {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });

      toast.success('Chapters reordered');
      router.refresh();
    } catch {
      toast.error('something went wrong! Please try again');
    } finally {
      setIsUpdating(false);
    }
  }

  const handleEdit = (id: string) =>
    router.push(`/api/course/${courseId}/chapters/${id}`);

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
          <Loader2 className='animate-spin h-6 w-6 text-orange-700' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Course Chapter
        <Button
          variant='ghost'
          onClick={toggleCreating}
          className='cursor-pointer'>
          {isCreating && <>cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className='h-4 w-4 mr-1' />
              Add chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g `Introduction to the course`'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type='submit'>
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.chapters.length && 'text-slate-500 italic',
          )}>
          {!initialData.chapters.length && ' No chapters'}

          <ChapterList
            items={initialData.chapters || []}
            onReorder={handleReorder}
            onEdit={handleEdit}
          />
        </div>
      )}
      {!isCreating && (
        <p className='text-xs text-mute-foreground mt-4'>
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}

export default ChapterForm;
