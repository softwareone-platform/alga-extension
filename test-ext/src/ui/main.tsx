import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import "./index.css";
import "@alga-psa/ui-kit/theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
