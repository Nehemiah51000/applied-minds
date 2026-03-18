'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';

import { Course } from '@/app/generated/prisma/client';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

interface IImageFormProps {
  initialData: Course;
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Course image is required',
  }),
});

function ImageForm({ initialData, courseId }: IImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('I am here', values);
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success('Image uploaded successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to update image. Please try again!');
    }
  };
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course image
        <Button variant='ghost' onClick={toggleEdit} className='cursor-pointer'>
          {isEditing && <>cancel</>}

          {!isEditing && !initialData.imageUrl! && (
            <>
              <PlusCircle className='h-4 w-4 mr-1' />
              Add Image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className='h-4 w-4 mr-1' />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              src={initialData.imageUrl}
              alt='Uploaded photo'
              fill
              className='object-cover rounded-md'
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseImage'
            onChange={async (url) => {
              if (url) {
                console.log(url);
                await handleSubmit({ imageUrl: url });
              }
            }}
            media='picture'
            maxSize={5}
          />
          <div className='text-sx text-muted-foreground mt-4'>
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;
