import {
  Menu,
  MenuButton,
  MenuItem,
  Button as HeadlessButton,
  ButtonProps as HeadlessButtonProps,
  MenuItems,
} from "@headlessui/react";
import { Button } from "./button";
import { ReactNode } from "react";
import clsx from "clsx";

export const Actions = ({ children }: { children: ReactNode }) => {
  return (
    <Menu>
      <MenuButton as={Button} variant="white">
        Actions
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
      className={clsx(
        className,
        "block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer w-full text-left"
      )}
      {...props}
    />
  );
};
