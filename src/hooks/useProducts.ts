import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  souvenir?: boolean;
}) => {
  return useQuery({
    queryKey: [
      "products",
      filters?.category,
      filters?.featured,
      filters?.souvenir,
    ],

    queryFn: () => productApi.getProducts(filters),

    staleTime: 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};