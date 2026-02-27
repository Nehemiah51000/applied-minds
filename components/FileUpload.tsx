'use client';

import { useRef, useState } from 'react';
import { ImageUp } from 'lucide-react';
import toast from 'react-hot-toast';

type UploadEndpoint = 'courseImage' | 'courseAttachment' | 'chapterVideo';

interface IFileUpload {
  onChange: (url?: string) => void;
  endpoint: UploadEndpoint;
}

const endpointFolderMap: Record<UploadEndpoint, string> = {
  courseImage: 'courseImage',
  courseAttachment: 'courseAttachment',
  chapterVideo: 'chapterVideo',
};

function FileUpload({ onChange, endpoint }: IFileUpload) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple client-side max size check: ~5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('File is too large. Max size is 5MB.');
      return;
    }

    try {
      setIsUploading(true);

      const folder = endpointFolderMap[endpoint];

      // 1) Ask our API for a signed upload payload
      const signRes = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder }),
      });

      if (!signRes.ok) {
        toast.error('Failed to prepare upload.');
        return;
      }

      const { timestamp, signature, cloudName, apiKey } =
        (await signRes.json()) as {
          timestamp: number;
          signature: string;
          cloudName: string;
          apiKey: string;
        };

      // 2) Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        toast.error('Upload failed.');
        return;
      }

      const uploadData = (await uploadRes.json()) as { secure_url?: string };

      if (uploadData.secure_url) {
        onChange(uploadData.secure_url);
        toast.success('Upload completed!');
      } else {
        toast.error('Upload did not return a URL.');
      }
    } catch {
      toast.error('Unexpected error during upload.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const openFileDialog = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  return (
    <div className='w-full'>
      <div
        role='button'
        onClick={openFileDialog}
        className='flex w-full flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-8 text-center transition hover:border-primary/60 hover:bg-muted/70'
      >
        <ImageUp className='mb-3 h-8 w-8 text-primary' />
        <p className='text-sm font-medium'>
          {isUploading ? 'Uploading image…' : 'Click to upload image'}
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          PNG, JPG, or JPEG up to 5MB
        </p>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        disabled={isUploading}
        className='hidden'
      />
    </div>
  );
}

export default FileUpload;
