import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],

    queryFn: () => productApi.getProductById(id),

    enabled: !!id,
  });
};