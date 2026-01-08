import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/ui/lib/alga";
import {
  ExtensionDetailsRequestBody,
  ExtensionDetailsResponseBody,
} from "@/shared/extension-details";

export const useExtensionDetails = () => {
  const { data, ...state } = useQuery({
    queryKey: ["extension", "details"],
    queryFn: async () => {
      const { data } = await backendClient.get<ExtensionDetailsResponseBody>(
        "/extension"
      );
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { details: data, ...state };
};

export const useExtensionDetailsMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: saveDetails,
    mutateAsync: saveDetailsAsync,
    ...state
  } = useMutation({
    mutationFn: (details: ExtensionDetailsRequestBody) =>
      backendClient.post<ExtensionDetailsResponseBody>("/extension", details),
    onSuccess: (details) =>
      queryClient.setQueryData(["extension", "details"], details),
  });

  return { saveDetails, saveDetailsAsync, state };
};
