import {
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  DialogPanelProps as HeadlessDialogPanelProps,
  DialogProps as HeadlessDialogProps,
  DialogTitle as HeadlessDialogTitle,
  DialogTitleProps as HeadlessDialogTitleProps,
} from "@headlessui/react";
import { clsx } from "clsx";

export const Dialog = ({ className, ...props }: HeadlessDialogProps) => {
  return (
    <HeadlessDialog
      {...props}
      className={clsx(
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
      className={clsx(
        className,
        "w-[600px] bg-white shadow-xl flex flex-col p-6 gap-6 duration-100 ease-out data-[closed]:opacity-0 border border-gray-200 rounded-2xl"
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
      className={clsx(className, "flex justify-between")}
      {...props}
    >
      <div className="text-2xl font-semibold">{children}</div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </HeadlessDialogTitle>
  );
};
