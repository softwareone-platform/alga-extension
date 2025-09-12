import {
  Radio as HeadlessRadio,
  RadioProps as HeadlessRadioProps,
  RadioGroup as HeadlessRadioGroup,
  RadioGroupProps as HeadlessRadioGroupProps,
  Field,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import { ReactNode } from "react";

// for now just a proxy
export const RadioGroup = ({
  className,
  ...props
}: HeadlessRadioGroupProps) => {
  return <HeadlessRadioGroup className={className} {...props} />;
};

export type RadioProps = HeadlessRadioProps & {
  children: ReactNode;
};

export const Radio = ({
  className,
  key,
  value,
  children,
  ...props
}: RadioProps) => {
  return (
    <Field key={key} className={clsx(className, "flex items-center gap-2")}>
      <HeadlessRadio
        value={value}
        className="group flex size-4 items-center justify-center rounded-full border-0 outline-2 -outline-offset-2 outline-gray-400 bg-white data-checked:bg-[rgb(var(--color-primary-600))] data-checked:outline-[rgb(var(--color-primary-600))]"
        {...props}
      >
        <span className="invisible size-[6px] rounded-full bg-white group-data-checked:visible" />
      </HeadlessRadio>
      <Label className="data-disabled:opacity-50">{children}</Label>
    </Field>
  );
};
