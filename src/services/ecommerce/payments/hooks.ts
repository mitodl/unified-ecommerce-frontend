import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useMutation,
} from "@tanstack/react-query";
import { paymentsApi } from "../client";
import type {
  CommerceApiCommerceApiV0PaymentsBasketsListRequest as PaymentsApiPaymentsBasketsListRequest,
  CommerceApiCommerceApiV0PaymentsBasketsCreateFromProductCreateRequest as PaymentsApiPaymentsBasketsCreateFromProductCreateRequest,
  CommerceApiCommerceApiV0PaymentsBasketsAddDiscountCreateRequest as PaymentsApiPaymentsBasketsAddDiscountCreateRequest,
  CommerceApiCommerceApiV0PaymentsCheckoutCreateRequest as PaymentsApiPaymentsCheckoutCreateRequest,
} from "@mitodl/unified-ecommerce-api-axios/v0";
import { AxiosResponse } from "axios";

type ExtraQueryOpts = Omit<UseQueryOptions, "queryKey" | "queryFn">;

const usePaymentsBasketList = (
  options: PaymentsApiPaymentsBasketsListRequest,
  opts: ExtraQueryOpts = {},
) =>
  useQuery({
    queryKey: ["paymentsBaskets", options],
    queryFn: async () => {
      const response = await paymentsApi.commerceApiV0PaymentsBasketsList(options);
      return response.data;
    },
    ...opts,
  });

const usePaymentsBasketRetrieve = (
  id: number,
  opts: ExtraQueryOpts & { queryKey?: UseQueryOptions["queryKey"] } = {},
) => {
  const { queryKey, ...restOpts } = opts; // Destructure queryKey from opts
  return useQuery({
    queryKey: queryKey || ["paymentsBaskets", id], // Use queryKey from opts or default
    queryFn: async () => {
      const response = await paymentsApi.commerceApiV0PaymentsBasketsRetrieve({ id });
      return response.data;
    },
    ...restOpts, // Spread the remaining options
  });
};

const usePaymentsBasketitemsDestroy = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      paymentsApi
        .commerceApiV0PaymentsBasketitemsDestroy({ id })
        .then((response: AxiosResponse) => response.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets"] });
    },
  });
};

const usePaymentsBasketsClearDestroy = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (systemSlug: string) =>
      paymentsApi
        .commerceApiV0PaymentsBasketsClearDestroy({
          system_slug: systemSlug,
        })
        .then((response: AxiosResponse) => response.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets"] });
    },
  });
};

const usePaymentsBasketCreateFromProduct = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (
      slugAndSku: PaymentsApiPaymentsBasketsCreateFromProductCreateRequest,
    ) =>
      paymentsApi
        .commerceApiV0PaymentsBasketsCreateFromProductCreate(slugAndSku)
        .then((response: AxiosResponse) => response.data),
    onSuccess: (_data) => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets", _data] });
    },
  });
};

const usePaymentsBasketAddDiscount = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (request: PaymentsApiPaymentsBasketsAddDiscountCreateRequest) =>
      paymentsApi
        .commerceApiV0PaymentsBasketsAddDiscountCreate(request)
        .then((response: AxiosResponse) => response.data),
    onSuccess: (_data) => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets", _data] });
    },
  });
};

const usePaymentsCheckoutStartCheckout = () => {
  return useMutation({
    mutationFn: (request: PaymentsApiPaymentsCheckoutCreateRequest) =>
      paymentsApi
        .commerceApiV0PaymentsCheckoutCreate(request)
        .then((response: AxiosResponse) => response.data),
  });
};

const usePaymentsOrderHistory = (opts: ExtraQueryOpts = {}) =>
  useQuery({
    queryKey: ["paymentsOrders"],
    queryFn: async () => {
      const response = await paymentsApi.commerceApiV0PaymentsOrdersHistoryList();
      return response.data;
    },
    ...opts,
  });

const usePayementsOrdersHistoryRetrieve = () => {
  return useMutation({
    mutationFn: (id: number) =>
      paymentsApi
        .commerceApiV0PaymentsOrdersHistoryRetrieve({ id })
        .then((response: AxiosResponse) => response.data),
  });
};

export {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
  usePaymentsBasketCreateFromProduct,
  usePaymentsBasketAddDiscount,
  usePaymentsCheckoutStartCheckout,
  usePaymentsOrderHistory,
  usePaymentsBasketitemsDestroy,
  usePaymentsBasketsClearDestroy,
  usePayementsOrdersHistoryRetrieve,
};
