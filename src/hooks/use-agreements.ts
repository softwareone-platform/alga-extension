import { useQuery } from '@tanstack/react-query';
import { AgreementsClient, type AgreementsOptions } from '../lib/swo-client/agreements-client';

interface UseAgreementsProps {
  client: AgreementsClient;
  options?: AgreementsOptions;
}

export const useAgreements = ({ client, options }: UseAgreementsProps) => {
  return useQuery({
    queryKey: ['agreements', options],
    queryFn: () => client.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};