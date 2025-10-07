import { forwardRef, ImgHTMLAttributes } from "react";
import { cn } from "@utils/cn";
import { useExtensionDetails } from "@features/extension";

type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  iconUrl?: string | null;
};

export const Icon = forwardRef<HTMLImageElement, IconProps>(
  ({ iconUrl, className, ...props }, ref) => {
    const { details } = useExtensionDetails();

    if (!iconUrl || !details) return <></>;

    const url = `${details.endpoint}${iconUrl.replace("v1/", "")}`.replace(
      /([^:])\/+/g,
      "$1/"
    );

    return (
      <img ref={ref} src={url} className={cn(className, "size-8")} {...props} />
    );
  }
);
