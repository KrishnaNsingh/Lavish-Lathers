import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 mins

      gcTime: 30 * 60 * 1000,

      retry: 2,

      refetchOnWindowFocus: false,

      refetchOnReconnect: true,
    },
  },
});