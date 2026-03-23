import {
  Radio as HeadlessRadio,
  RadioProps as HeadlessRadioProps,
  RadioGroup as HeadlessRadioGroup,
  RadioGroupProps as HeadlessRadioGroupProps,
  Field,
  Label,
} from "@headlessui/react";
import { cn } from "@utils/cn";
import { ReactNode, forwardRef } from "react";

export const RadioGroup = forwardRef<HTMLDivElement, HeadlessRadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <HeadlessRadioGroup
        ref={ref}
        className={cn(className, "flex flex-col gap-4")}
        {...props}
      />
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export type RadioProps = HeadlessRadioProps & {
  children: ReactNode;
};

export const Radio = forwardRef<HTMLDivElement, RadioProps>(
  ({ className, key, value, children, ...props }, ref) => {
    return (
      <Field key={key} className={cn(className, "flex items-center gap-2")}>
        <HeadlessRadio
          ref={ref}
          value={value}
          className="group flex size-4 items-center justify-center rounded-full border-0 outline-2 -outline-offset-2 outline-border-400 bg-white data-checked:bg-primary-600 data-checked:outline-primary-600 cursor-pointer"
          {...props}
        >
          <span className="invisible size-[6px] rounded-full bg-white group-data-checked:visible" />
        </HeadlessRadio>
        <Label className="data-disabled:opacity-50 text-sm cursor-pointer">
          {children}
        </Label>
      </Field>
    );
  }
);

Radio.displayName = "Radio";
