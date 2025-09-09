import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExtensionClient } from "./context";
import { ExtensionDetails } from "@lib/extension-data";

export const useExtensionDetails = () => {
  const client = useExtensionClient();

  const { data, ...state } = useQuery({
    queryKey: ["extension", "details"],
    queryFn: async () => client.getDetails(),
    placeholderData: {
      endpoint: "",
      token: "",
      note: "",
      status: "",
    } as ExtensionDetails,
  });

  return { details: data!, ...state };
};

export const useExtensionDetailsMutation = () => {
  const client = useExtensionClient();
  const queryClient = useQueryClient();

  const {
    mutate: saveDetails,
    mutateAsync: saveDetailsAsync,
    ...state
  } = useMutation({
    mutationFn: (details: ExtensionDetails) => client.saveDetails(details),
    onSuccess: (details) =>
      queryClient.setQueryData(["extension", "details"], details),
  });

  return { saveDetails, saveDetailsAsync, state };
};

export const useExtensionDetailsMutations = () => {
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
