import {
  Listbox as HeadlessListbox,
  ListboxProps as HeadlessListboxProps,
  ListboxButton as HeadlessListboxButton,
  ListboxButtonProps as HeadlessListboxButtonProps,
  ListboxOptions as HeadlessListboxOptions,
  ListboxOptionsProps as HeadlessListboxOptionsProps,
  ListboxOption as HeadlessListboxOption,
  ListboxOptionProps as HeadlessListboxOptionProps,
  Button as HeadlessButton,
} from "@headlessui/react";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export const Listbox = ({ ...props }: HeadlessListboxProps) => {
  return <HeadlessListbox {...props} />;
};

export type ListboxButtonProps = HeadlessListboxButtonProps & {
  children: ReactNode;
};

export const ListboxButton = ({
  className,
  children,
  ...props
}: ListboxButtonProps) => {
  return (
    <HeadlessListboxButton
      as={HeadlessButton}
      {...({ variant: "white" } as any)}
      className={clsx(
        className,
        "w-full px-3 py-2 rounded-lg text-sm border border-gray-300 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-[rgb(var(--color-primary-600))] flex justify-between items-center cursor-pointer hover:bg-[rgb(var(--color-primary-50))] hover:text-[rgb(var(--color-primary-700))]"
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="size-4" />
    </HeadlessListboxButton>
  );
};

export const ListboxOptions = ({
  className,
  ...props
}: HeadlessListboxOptionsProps) => {
  return (
    <HeadlessListboxOptions
      className={clsx(
        className,
        "bg-white border border-gray-200 rounded-lg p-1 outline-0 mt-1 text-sm shadow-xl absolute min-w-(--button-width) z-10"
      )}
      {...props}
    />
  );
};

export const ListboxOption = ({
  className,
  ...props
}: HeadlessListboxOptionProps) => {
  return (
    <HeadlessListboxOption
      as={HeadlessButton}
      className={clsx(
        className,
        "block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer w-full text-left"
      )}
      {...props}
    />
  );
};
