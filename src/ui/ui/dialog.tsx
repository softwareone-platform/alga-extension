import {
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  DialogPanelProps as HeadlessDialogPanelProps,
  DialogProps as HeadlessDialogProps,
  DialogTitle as HeadlessDialogTitle,
  DialogTitleProps as HeadlessDialogTitleProps,
} from "@headlessui/react";
import { cn } from "@utils/cn";
import { X } from "lucide-react";

export const Dialog = ({ className, ...props }: HeadlessDialogProps) => {
  return (
    <HeadlessDialog
      {...props}
      className={cn(
        className,
        "flex justify-center items-center fixed inset-0"
      )}
    />
  );
};

export const DialogPanel = ({
  className,
  ...props
}: HeadlessDialogPanelProps) => {
  return (
    <HeadlessDialogPanel
      transition
      className={cn(
        "w-[600px] bg-white shadow-xl flex flex-col p-6 gap-6 duration-100 ease-out data-[closed]:opacity-0 border border-gray-200 rounded-2xl",
        className
      )}
      {...props}
    />
  );
};

export type DialogTitleProps = HeadlessDialogTitleProps & {
  onClose: () => void;
  children: React.ReactNode;
};

export const DialogTitle = ({
  className,
  onClose,
  children,
  ...props
}: DialogTitleProps) => {
  return (
    <HeadlessDialogTitle
      className={cn(className, "flex justify-between")}
      {...props}
    >
      <div className="text-2xl font-semibold">{children}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <X />
      </button>
    </HeadlessDialogTitle>
  );
};
