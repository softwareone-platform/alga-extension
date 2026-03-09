import { Tabs } from "@alga-psa/ui-kit";
import { Outlet, useLocation, useNavigate } from "react-router";

export function Start() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <h1 className="text-3xl font-semibold">Software</h1>
      </header>
      <Tabs
        tabs={[
          { key: "agreements", label: "Agreements", content: null },
          { key: "subscriptions", label: "Subscriptions", content: null },
          { key: "orders", label: "Orders", content: null },
          { key: "statements", label: "Statements", content: null },
        ]}
        activeKey={location.pathname.split("/").pop() || "agreements"}
        onChange={(key) => navigate(key)}
      />
      <Outlet />
    </div>
  );
}
