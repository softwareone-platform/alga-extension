import { LinkButton } from "@ui/button";
import { Card, Tabs } from "@alga-psa/ui-kit";
import { Icon } from "@ui/icon";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Loader, PageLoader } from "@/ui/ui/loaders";

import { useBillingConfigByAgreement } from "@features/billing-config";
import { Price, PriceWithMarkup } from "@features/price";
import { OrderStatusBadge, useOrder } from "@features/orders";
import { useConsumer } from "@features/consumers";
import { Link } from "@/ui/ui/link";
import { SWO_PORTAL_URL } from "@/ui/config";

function OrderSummary({ id }: { id: string }) {
  const { order, isPending: isOrderPending } = useOrder(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(order?.agreement?.id);

  const { consumer } = useConsumer(billingConfig?.consumerId);

  if (isOrderPending || isBillingConfigPending) return <Loader />;

  if (!order) return <></>;

  return (
    <Card className="flex flex-row justify-between gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Type</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{order.type}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{order.agreement?.name}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={order.product?.icon}
            alt={order.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {order.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow text-sm">
          <Link to={consumer?.id ? `/consumers/${consumer.id}` : undefined}>{consumer?.name}</Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black"><Price currency={order.price?.currency} value={order.price?.SPxY} /></span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Margin</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {billingConfig?.markup ? `${billingConfig.markup}%` : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black"><PriceWithMarkup currency={order?.price?.currency} value={order?.price?.SPxY} markup={billingConfig?.markup} /></span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {order.price?.currency || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Created</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {order.audit?.created?.at
              ? new Date(order.audit.created.at).toLocaleDateString()
              : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Order() {
  const { id } = useParams<{ id: string }>();
  const { order, isPending } = useOrder(id!);
  const navigate = useNavigate();
  const location = useLocation();
  if (isPending) return <PageLoader />;

  if (!order) return <div>Order not found</div>;

  const { status } = order;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{id}</h1>
          {!!status && <OrderStatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <LinkButton
            variant="white"
            href={`${SWO_PORTAL_URL}/commerce/orders/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in SoftwareOne
          </LinkButton>
        </div>
      </header>
      <OrderSummary id={id!} />
      <Tabs
        tabs={[
          { key: "items", label: "Items", content: null },
          { key: "details", label: "Details", content: null },
        ]}
        activeKey={location.pathname.split("/").pop() || "items"}
        onChange={(key) => navigate(key)}
      />
      <Outlet />
    </div>
  );
}
