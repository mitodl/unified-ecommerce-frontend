import { useQuery } from "@tanstack/react-query";
import { metaApi } from "../client";

const useMetaIntegratedSystemsList = () =>
  useQuery({
    queryKey: ["metaIntegratedSystems"],
    queryFn: async () => {
      const response = await metaApi.metaIntegratedSystemList();
      return response.data;
    },
  });

const useMetaProductsList = (systemSlug: string) =>
  useQuery({
    queryKey: ["metaProducts"],
    queryFn: async () => {
      const response = await metaApi.metaProductList({
        system__slug: systemSlug,
      });
      return response.data;
    },
  });

export { useMetaIntegratedSystemsList, useMetaProductsList };
