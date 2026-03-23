export type Client = {
  id: string;
  tenantId: string;
  name: string;
  type: "company" | "individual";
  website?: string;
};
