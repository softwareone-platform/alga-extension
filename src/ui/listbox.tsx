import {
  Listbox as HeadlessListbox,
  ListboxProps as HeadlessListboxProps,
  ListboxButton as HeadlessListboxButton,
  ListboxOptions as HeadlessListboxOptions,
  ListboxOptionsProps as HeadlessListboxOptionsProps,
  ListboxOption as HeadlessListboxOption,
  ListboxOptionProps as HeadlessListboxOptionProps,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Button } from "./button";
import { ReactNode } from "react";

export const Listbox = ({ ...props }: HeadlessListboxProps) => {
  return <HeadlessListbox {...props} />;
};

export type ListboxButtonProps = {
  className?: string;
  children: ReactNode;
};

export const ListboxButton = ({ className, ...props }: ListboxButtonProps) => {
  return (
    <HeadlessListboxButton
      as={Button}
      variant="white"
      className={clsx(className, "gap-1 pl-3")}
      {...props}
    />
  );
};

export const ListboxOptions = ({
  className,
  ...props
}: HeadlessListboxOptionsProps) => {
  return (
    <HeadlessListboxOptions
      className={clsx(className, "relative")}
      {...props}
    />
  );
};

export const ListboxOption = ({
  className,
  ...props
}: HeadlessListboxOptionProps) => {
  return (
    <HeadlessListboxOption className={clsx(className, "relative")} {...props} />
  );
};
