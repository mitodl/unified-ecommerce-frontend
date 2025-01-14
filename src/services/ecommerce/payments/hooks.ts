import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useMutation,
} from "@tanstack/react-query";
import { paymentsApi } from "../client";
import type {
  PaymentsApiPaymentsBasketsListRequest,
  PaymentsApiPaymentsBasketsCreateFromProductCreateRequest,
  PaymentsApiPaymentsBasketsAddDiscountCreateRequest,
  PaymentsApiPaymentsCheckoutCreateRequest,
} from "@mitodl/unified-ecommerce-api-axios/v0";

type ExtraQueryOpts = Omit<UseQueryOptions, "queryKey" | "queryFn">;

const usePaymentsBasketList = (
  options: PaymentsApiPaymentsBasketsListRequest,
  opts: ExtraQueryOpts = {},
) =>
  useQuery({
    queryKey: ["paymentsBaskets", options],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsList(options);
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
      const response = await paymentsApi.paymentsBasketsRetrieve({ id });
      return response.data;
    },
    ...restOpts, // Spread the remaining options
  });
};

const usePaymentsBasketCreateFromProduct = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (
      slugAndSku: PaymentsApiPaymentsBasketsCreateFromProductCreateRequest,
    ) =>
      paymentsApi
        .paymentsBasketsCreateFromProductCreate(slugAndSku)
        .then((response) => response.data),
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
        .paymentsBasketsAddDiscountCreate(request)
        .then((response) => response.data),
    onSuccess: (_data) => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets", _data] });
    },
  });
};

const usePaymentsCheckoutStartCheckout = () => {
  return useMutation({
    mutationFn: (request: PaymentsApiPaymentsCheckoutCreateRequest) =>
      paymentsApi
        .paymentsCheckoutCreate(request)
        .then((response) => response.data),
  });
};

const usePaymentsOrderHistory = (opts: ExtraQueryOpts = {}) =>
  useQuery({
    queryKey: ["paymentsOrders"],
    queryFn: async () => {
      const response = await paymentsApi.paymentsOrdersHistoryList();
      return response.data;
    },
    ...opts,
  });

export {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
  usePaymentsBasketCreateFromProduct,
  usePaymentsBasketAddDiscount,
  usePaymentsCheckoutStartCheckout,
  usePaymentsOrderHistory,
};
