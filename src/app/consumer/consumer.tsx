import { Tabs } from "@ui/tabs";
import { NavLink, Outlet } from "react-router";

export function Consumer() {
  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <h1 className="text-3xl font-semibold">Software</h1>
      </header>
      <Tabs>
        <NavLink to="agreements">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Agreements</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="subscriptions">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Subscriptions</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="orders">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Orders</Tabs.Tab>}
        </NavLink>
        <NavLink to="statements">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Statements</Tabs.Tab>
          )}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
