'use client';

import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface IConfirmModalProps {
  children: ReactNode;
  onConfirm: () => void;
}

function ConfirmModal({ children, onConfirm }: IConfirmModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this chapter? 
          </AlertDialogTitle>
          <AlertDialogDescription>
This action cannot be
            undone. Please ensure to backup any important data before you delete the chapter.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
<AlertDialogCancel>
    Cancel
</AlertDialogCancel>
<AlertDialogAction onClick={onConfirm}>
    Continue

</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmModal;
