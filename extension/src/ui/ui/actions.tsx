import {
  Menu,
  MenuButton,
  MenuItem,
  Button as HeadlessButton,
  ButtonProps as HeadlessButtonProps,
  MenuItems,
} from "@headlessui/react";
import { ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import { cn } from "@utils/cn";

export const Actions = ({ children }: { children: ReactNode }) => {
  return (
    <Menu>
      <MenuButton className="flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary-600 ring-offset-background relative h-10 py-2 px-4 cursor-pointer border border-border-400 bg-white text-text-700 hover:bg-primary-50 hover:text-primary-700 gap-1 pl-3">
        <EllipsisVertical className="size-4" />
        <span>Actions</span>
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="bg-white border border-gray-200 rounded-lg p-1 outline-0 mt-1 text-sm shadow-xl"
      >
        {children}
      </MenuItems>
    </Menu>
  );
};

export const ActionItem = ({
  className,
  ...props
}: HeadlessButtonProps & { children: ReactNode }) => {
  return (
    <MenuItem
      as={HeadlessButton}
      className={cn(
        className,
        "block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer w-full text-left"
      )}
      {...props}
    />
  );
};
