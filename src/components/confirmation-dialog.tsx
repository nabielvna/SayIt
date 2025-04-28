import React from 'react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  /**
   * The trigger element that will open the dialog
   */
  trigger: React.ReactNode;
  /**
   * The title of the confirmation dialog
   */
  title: string;
  /**
   * The description/message of the confirmation dialog
   */
  description: string;
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  /**
   * Text for the confirm button
   */
  confirmText?: string;
  /**
   * Variant for the confirm button
   */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /**
   * Function to execute when confirmed
   */
  onConfirm: () => void;
}

/**
 * A reusable confirmation dialog component built with shadcn/ui
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmVariant = "default",
  onConfirm,
}) => {
  return (
    <div onClick={(e) => {
        e.preventDefault(); 
        e.stopPropagation();
    }} className="flex items-center justify-center w-fit h-fit p-0 m-0">
        <AlertDialog>
        <AlertDialogTrigger asChild className='hover:cursor-pointer'>
            {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
                {description}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>{cancelText}</AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button 
                variant={confirmVariant} 
                onClick={onConfirm}
                >
                {confirmText}
                </Button>
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default ConfirmationDialog;