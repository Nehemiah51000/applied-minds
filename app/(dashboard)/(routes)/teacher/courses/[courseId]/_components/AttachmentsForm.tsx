'use client';

import { useRouter } from 'next/navigation';
import z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { File, Pencil, Loader2, X } from 'lucide-react';

import { Attachment, Course } from '@/app/generated/prisma/client';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

interface IAttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

function AttachmentsForm({ initialData, courseId }: IAttachmentsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setIsDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success('Attachment deleted successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(
        'Something went wrong while deleting the attachment, please try again.',
      );

      console.log(error);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);

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

          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                  <File className='h-4 w-4 mr-2 shrink-0' />
                  <p className='text-sx line-clamp-1'>{attachment.name}</p>

                  {isDeletingId === attachment.id && (
                    <div className='ml-auto'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                    </div>
                  )}

                  {isDeletingId !== attachment.id && (
                    <button
                      onClick={() => handleDelete(attachment.id)}
                      className='hover:opacity-75 ml-auto transition'>
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
