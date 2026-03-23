import { forwardRef } from "react";
import { cn } from "@utils/cn";
import {
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
  Textarea as HeadlessTextarea,
  TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";

export const Input = forwardRef<HTMLInputElement, HeadlessInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <HeadlessInput
        ref={ref}
        className={cn(
          className,
          "w-full px-3 py-2 rounded-lg text-sm border border-border-300 focus:outline-2 focus:-outline-offset-1 focus:outline-primary-600"
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, HeadlessTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <HeadlessTextarea
        ref={ref}
        className={cn(
          className,
          "w-full px-3 py-2 rounded-lg text-sm border border-border-300 focus:outline-2 focus:-outline-offset-1 focus:outline-primary-600"
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
