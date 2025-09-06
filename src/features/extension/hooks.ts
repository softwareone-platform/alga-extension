import { useContext } from "react";
import { ExtensionContext, type ExtensionContextType } from "./context";

export const useExtension = (): ExtensionContextType => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error(
      "useExtensionContext must be used within an ExtensionProvider"
    );
  }
  return context;
};