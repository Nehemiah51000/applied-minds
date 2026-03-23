'use client';

import { useRef, useState } from 'react';
import { ImageUp } from 'lucide-react';
import toast from 'react-hot-toast';

type UploadEndpoint = 'courseImage' | 'courseAttachment' | 'chapterVideo';
type Media = 'video' | 'picture' | 'attachment';

interface IFileUpload {
  onChange: (url?: string) => void;
  endpoint: UploadEndpoint;
  maxSize: number;
  media: Media;
}

const endpointFolderMap: Record<UploadEndpoint, string> = {
  courseImage: 'courseImage',
  courseAttachment: 'courseAttachment',
  chapterVideo: 'chapterVideo',
};

function FileUpload({ onChange, endpoint, maxSize, media }: IFileUpload) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const urlMedia =
    media === 'picture' ? 'image' : media === 'video' ? 'video' : 'raw';

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple client-side max size check: ~5MB
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File is too large. Max size is ${maxSize}MB.`);
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
        `https://api.cloudinary.com/v1_1/${cloudName}/${urlMedia}/upload`,
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
        className='flex w-full flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-8 text-center transition hover:border-primary/60 hover:bg-muted/70'>
        <ImageUp className='mb-3 h-8 w-8 text-primary' />
        <p className='text-sm font-medium'>
          {isUploading ? `Uploading ${media}…` : `Click to upload ${media}`}
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          {media === 'picture' && ` PNG, JPG, or JPEG up to ${maxSize}MB`}
          {media === 'video' && ` MP4, MKV, or MPEG up to ${maxSize}MB`}
          {media === 'attachment' && `Add any file up to ${maxSize}MB`}
        </p>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept={
          media === 'picture'
            ? 'image/*'
            : media === 'video'
              ? 'video/*'
              : '*/*'
        }
        onChange={handleFileChange}
        disabled={isUploading}
        className='hidden'
      />
    </div>
  );
}

export default FileUpload;
