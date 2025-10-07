import {
  Dialog,
  DialogPanel,
  DialogPanelProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from "@headlessui/react";
import { cn } from "@utils/cn";
import { X } from "lucide-react";

export type DrawerProps = DialogProps & {
  children: React.ReactNode;
};

export const Drawer = ({ className, children, ...props }: DrawerProps) => {
  return (
    <Dialog {...props} className={cn(className, "relative z-50")}>
      <div className="fixed inset-0 flex justify-end">{children}</div>
    </Dialog>
  );
};

export const DrawerPanel = ({ className, ...props }: DialogPanelProps) => {
  return (
    <DialogPanel
      transition
      className={cn(
        className,
        "h-full w-[600px] shadow-xl bg-white flex flex-col py-6 px-10 gap-10 duration-200 ease-out data-[closed]:translate-x-full"
      )}
      {...props}
    />
  );
};

export type DrawerTitleProps = DialogTitleProps & {
  onClose: () => void;
  children: React.ReactNode;
};

export const DrawerTitle = ({
  className,
  onClose,
  children,
  ...props
}: DrawerTitleProps) => {
  return (
    <DialogTitle className={cn(className, "flex justify-between")} {...props}>
      <div className="text-3xl font-semibold">{children}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <X />
      </button>
    </DialogTitle>
  );
};
