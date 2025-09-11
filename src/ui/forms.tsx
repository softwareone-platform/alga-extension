import { clsx } from "clsx";
import {
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
  Textarea as HeadlessTextarea,
  TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";

export const Input = ({ className, ...props }: HeadlessInputProps) => {
  return (
    <HeadlessInput
      className={clsx(
        className,
        "w-full px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-2 focus:-outline-offset-1 focus:outline-[rgb(var(--color-primary-600))]"
      )}
      {...props}
    />
  );
};

export const Textarea = ({ className, ...props }: HeadlessTextareaProps) => {
  return (
    <HeadlessTextarea
      className={clsx(
        className,
        "w-full px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-2 focus:-outline-offset-1 focus:outline-[rgb(var(--color-primary-600))]"
      )}
      {...props}
    />
  );
};
