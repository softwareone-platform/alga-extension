import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExtensionClient } from "./context";
import { ExtensionSettings, ExtensionStatus } from "@lib/extension-data";

export const useExtensionSettings = () => {
  const client = useExtensionClient();

  const { data, ...state } = useQuery({
    queryKey: ["extension", "settings"],
    queryFn: async () => client.getSettings(),
    initialData: {
      endpoint: "",
      token: "",
      note: "",
    },
  });

  return { extensionSettings: data, ...state };
};

export const useExtensionSettingsMutation = () => {
  const client = useExtensionClient();

  const {
    mutate: save,
    mutateAsync: saveAsync,
    ...state
  } = useMutation({
    mutationFn: (settings: ExtensionSettings) => client.saveSettings(settings),
  });

  return { save, saveAsync, state };
};

export const useExtensionStatus = () => {
  const client = useExtensionClient();

  const { data, ...state } = useQuery({
    queryKey: ["extension", "status"],
    queryFn: () => client.getStatus(),
    initialData: "unconfigured",
  });

  return { extensionStatus: data as ExtensionStatus, ...state };
};

export const useExtensionStatusMutations = () => {
  const client = useExtensionClient();
  const queryClient = useQueryClient();

  const {
    mutate: disable,
    mutateAsync: disableAsync,
    ...disableState
  } = useMutation({
    mutationFn: () => client.disable(),
    onSuccess: () => queryClient.resetQueries(),
  });

  const {
    mutate: enable,
    mutateAsync: enableAsync,
    ...enableState
  } = useMutation({
    mutationFn: () => client.enable(),
    onSuccess: () => queryClient.resetQueries(),
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
