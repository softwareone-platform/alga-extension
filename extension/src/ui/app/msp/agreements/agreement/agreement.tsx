import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Input, Textarea } from "@ui/input";
import { useAgreement, AgreementStatusBadge } from "@features/agreements";
import {
  useBillingConfigsMutation,
  useBillingConfigs,
} from "@features/billing-config";
import { BillingConfigChanges } from "@/lib/billing-config";
import { Radio, RadioGroup } from "@ui/radio";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@ui/listbox";
import { withMarkup } from "@features/markup";
import { useConsumer, useConsumers } from "@features/consumers";
import { useServices } from "@features/services";
import { useForm, Controller } from "react-hook-form";

function AgreementSummary({ id }: { id: string }) {
  const { agreement, isPending: isAgreementPending } = useAgreement(id);
  const { billingConfigs, isPending: isBillingConfigPending } =
    useBillingConfigs();

  const billingConfig = useMemo(() => {
    console.log("billingConfigs", billingConfigs);
    return billingConfigs?.find((v) => v.agreementId === id);
  }, [billingConfigs, id]);

  const { consumer } = useConsumer(billingConfig?.consumerId);

  const RPxY = useMemo(
    () => withMarkup(agreement?.price?.SPxY, billingConfig?.markup),
    [agreement?.price?.SPxY, billingConfig?.markup]
  );

  if (isAgreementPending || isBillingConfigPending)
    return <div>Loading...</div>;

  if (!agreement) return <div>Agreement not found</div>;

  return (
    <Card className="flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{agreement.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.product?.icon}
            alt={agreement.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.vendor?.icon}
            alt={agreement.vendor?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.vendor?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Billing config
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{billingConfig?.id || "—"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{consumer?.name || "—"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.price?.SPxY || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Markup</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {billingConfig?.markup ? `${billingConfig.markup}%` : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{RPxY}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.price?.currency || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Operations</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {billingConfig?.operations || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

const ConsumersListbox = ({
  consumerId,
  onConsumerIdChange,
}: {
  consumerId: string;
  onConsumerIdChange: (id: string) => void;
}) => {
  const { consumers } = useConsumers();

  const consumer = useMemo(
    () => consumers?.data?.find((v) => v.id === consumerId),
    [consumers, consumerId]
  );

  return (
    <Listbox value={consumerId} onChange={onConsumerIdChange}>
      <ListboxButton>{consumer?.name ?? "-"}</ListboxButton>
      <ListboxOptions>
        {consumers?.data?.map((consumer) => (
          <ListboxOption key={consumer.id} value={consumer.id}>
            {consumer.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const ServiceListbox = ({
  serviceId,
  onServiceIdChange,
}: {
  serviceId: string;
  onServiceIdChange: (id: string) => void;
}) => {
  const { services } = useServices();

  const service = useMemo(
    () => services?.data?.find((v) => v.id === serviceId),
    [services, serviceId]
  );

  return (
    <Listbox value={serviceId} onChange={onServiceIdChange}>
      <ListboxButton>{service?.name ?? "-"}</ListboxButton>
      <ListboxOptions>
        {services?.data?.map((service) => (
          <ListboxOption key={service.id} value={service.id}>
            {service.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

function BillingConfigEditor({
  isOpen,
  onClose,
  agreementId,
}: {
  isOpen: boolean;
  onClose: () => void;
  agreementId: string;
}) {
  const { billingConfigs } = useBillingConfigs();

  const { control, handleSubmit, reset, register } =
    useForm<BillingConfigChanges>({
      defaultValues: {
        note: "",
        markup: 0,
        operations: "self-service",
        consumerId: undefined,
        serviceId: undefined,
      },
    });

  useEffect(() => {
    const billingConfig = billingConfigs?.find(
      (v) => v.agreementId === agreementId
    );
    if (billingConfig) {
      reset({
        note: billingConfig.note ?? "",
        markup: billingConfig.markup ?? 0,
        operations: billingConfig.operations ?? "self-service",
        consumerId: billingConfig.consumerId,
        serviceId: billingConfig.serviceId,
      });
    }
  }, [billingConfigs]);

  const { saveBillingConfigs } = useBillingConfigsMutation();

  const onSubmit = handleSubmit((data) => {
    saveBillingConfigs([
      ...billingConfigs!.filter((v) => v.agreementId !== agreementId),
      {
        ...data,
        agreementId,
      },
    ]);
    onClose();
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Drawer open={isOpen} onClose={handleCancel}>
      <DrawerPanel>
        <DrawerTitle onClose={handleCancel}>SoftwareOne Settings</DrawerTitle>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-[auto_380px] gap-10 items-center">
            <label className="text-sm font-medium">Consumer</label>
            <div>
              <Controller
                name="consumerId"
                control={control}
                render={({ field }) => (
                  <ConsumersListbox
                    consumerId={field.value}
                    onConsumerIdChange={field.onChange}
                  />
                )}
              />
            </div>
            <label className="text-sm font-medium">Service</label>
            <div>
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <ServiceListbox
                    serviceId={field.value}
                    onServiceIdChange={field.onChange}
                  />
                )}
              />
            </div>
            <label className="text-sm font-medium">Markup</label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                {...register("markup", { valueAsNumber: true })}
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] pr-13"
              />
              <span className="absolute right-0 top-[1px] h-[calc(100%-2px)] flex items-center justify-center text-sm border-l border-gray-300 w-10 px-2">
                %
              </span>
            </div>

            <label className="text-sm font-medium self-start">Operations</label>
            <Controller
              name="operations"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={field.onChange}
                  aria-label="Operations"
                >
                  <Radio value="self-service">
                    <span>
                      Self-service (Clients will see Agreement details)
                    </span>
                  </Radio>
                  <Radio value="managed">
                    <span>Managed (Not visible to Clients)</span>
                  </Radio>
                </RadioGroup>
              )}
            />

            <label className="text-sm font-medium self-start">Note</label>
            <Textarea {...register("note")} rows={4} />
          </div>

          <div className="flex justify-end gap-6">
            <Button variant="white" onClick={handleCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DrawerPanel>
    </Drawer>
  );
}

export function Agreement() {
  const { id } = useParams<{ id: string }>();
  const { agreement, isPending } = useAgreement(id!);
  const [isOpen, setIsOpen] = useState(false);

  if (isPending) return <div>Loading...</div>;

  if (!agreement) return <div>Agreement not found</div>;

  const { name, status } = agreement;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{name}</h1>
          {!!status && <AgreementStatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </header>
      <AgreementSummary id={id!} />
      <BillingConfigEditor
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        agreementId={id!}
      />
      <Tabs>
        <NavLink to="softwareone">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>SoftwareOne</Tabs.Tab>
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
        <NavLink to="consumer">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Consumer</Tabs.Tab>}
        </NavLink>
        <NavLink to="billing">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Billing</Tabs.Tab>}
        </NavLink>
        <NavLink to="details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
