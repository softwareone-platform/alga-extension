import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExtensionClient } from "./context";
import { ExtensionDetailsChanges } from "@lib/alga/settings";

export const useExtensionDetails = () => {
  const client = useExtensionClient();

  const { data, ...state } = useQuery({
    queryKey: ["extension", "details"],
    queryFn: async () => client.getDetails(),
  });

  return { details: data, ...state };
};

export const useExtensionDetailsMutation = () => {
  const client = useExtensionClient();
  const queryClient = useQueryClient();

  const {
    mutate: saveDetails,
    mutateAsync: saveDetailsAsync,
    ...state
  } = useMutation({
    mutationFn: (details: ExtensionDetailsChanges) =>
      client.saveDetails(details),
    onSuccess: (details) =>
      queryClient.setQueryData(["extension", "details"], details),
  });

  return { saveDetails, saveDetailsAsync, state };
};

export const useExtensionStatusMutations = () => {
  const client = useExtensionClient();
  const queryClient = useQueryClient();

  const {
    mutate: disable,
    mutateAsync: disableAsync,
    ...disableState
  } = useMutation({
    mutationFn: (note?: string) => client.disable(note),
    onSuccess: () =>
      queryClient.setQueryData(["extension", "details"], {
        ...(queryClient.getQueryData(["extension", "details"]) || {}),
        status: "disabled",
      }),
  });

  const {
    mutate: enable,
    mutateAsync: enableAsync,
    ...enableState
  } = useMutation({
    mutationFn: (note?: string) => client.enable(note),
    onSuccess: () =>
      queryClient.setQueryData(["extension", "details"], {
        ...(queryClient.getQueryData(["extension", "details"]) || {}),
        status: "active",
      }),
  });

  return {
    disable,
    disableAsync,
    disableState,
    enable,
    enableAsync,
    enableState,
  };
};
