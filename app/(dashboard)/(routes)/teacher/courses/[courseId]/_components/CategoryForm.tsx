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
import { Course } from '@/app/generated/prisma/client';
import { CategoryCombobox } from './CategoryCombobox';

interface ICategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, {}),
});

function CategoryForm({ initialData, courseId, options }: ICategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success('Category updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to update category. Please try again!');
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId,
  );
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course category
        <Button variant='ghost' onClick={toggleEdit} className='cursor-pointer'>
          {isEditing && <>cancel</>}
          {!isEditing && (
            <>
              {' '}
              <Pencil className='h-4 w-4 mr-1' />
              Edit category{' '}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.categoryId && 'text-slate-500 italic',
          )}>
          {selectedOption?.label || 'No category'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategoryCombobox
                      options={options}
                      value={options.find((o) => o.value === field.value) ?? null}
                      onValueChange={(option) => {
                        form.setValue('categoryId', option?.value ?? '', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
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

export default CategoryForm;
