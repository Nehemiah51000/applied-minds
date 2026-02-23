'use client';

import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/app/generated/prisma/client';

interface IDescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: 'Course description is required',
  }),
});

function DescriptionForm({ initialData, courseId }: IDescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success('Description updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to update description. Please try again!');
    }
  };
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course description
        <Button variant='ghost' onClick={toggleEdit} className='cursor-pointer'>
          {isEditing && <>cancel</>}
          {!isEditing && (
            <>
              {' '}
              <Pencil className='h-4 w-4 mr-1' />
              Edit description{' '}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic',
          )}>
          {initialData.description || 'No description'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder='e.g `Advanced Web Programming is a course meant for seasoned professionals....`'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default DescriptionForm;
