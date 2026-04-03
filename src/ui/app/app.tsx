import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useExtensionDetails } from "@features/extension";

export function App() {
  const { details, isPending } = useExtensionDetails();

  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (details?.status !== "active") {
      navigate("/inactive", { replace: true });
    }
  }, [details, isPending]);

  if (isPending) return <></>;

  return <Outlet />;
}
