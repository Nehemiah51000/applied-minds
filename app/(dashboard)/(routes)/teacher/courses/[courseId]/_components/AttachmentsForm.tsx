'use client';

import { useRouter } from 'next/navigation';
import z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';

import { Attachment, Course } from '@/app/generated/prisma/client';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import Image from 'next/image';

interface IAttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

function AttachmentsForm({ initialData, courseId }: IAttachmentsFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      console.log(courseId);

      toast.success('Attachment uploaded successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error('Failed to update. Please try again!');
    }
  };
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Resources & Attachments
        <Button variant='ghost' onClick={toggleEdit} className='cursor-pointer'>
          {isEditing && <>cancel</>}
          {!isEditing && (
            <>
              <Pencil className='h-4 w-4 mr-1' />
              Add file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm text-slate-500 italic'>No attachments yet</p>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={async (url) => {
              if (url) {
                await handleSubmit({ url: url });
              }
            }}
          />
          <div className='text-sx text-muted-foreground mt-4'>
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentsForm;
