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
} from "../generated/v0/api";

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

const usePaymentsBasketRetrieve = (id: number, opts: ExtraQueryOpts = {}) => {
  return useQuery({
    queryKey: ["paymentsBaskets", id],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsRetrieve({ id });
      return response.data;
    },
    ...opts,
  });
};

const usePaymentsBaksetCreateFromProduct = () => {
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

const usePaymentsOrderHistory = (
  options: PaymentsApiPaymentsOrdersHistoryListRequest,
  opts: ExtraQueryOpts = {},
) =>
  useQuery({
    queryKey: ["paymentsOrders", options],
    queryFn: async () => {
      const response = await paymentsApi.paymentsOrdersHistoryList(options);
      return response.data;
    },
    ...opts,
  });

export {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
  usePaymentsBaksetCreateFromProduct,
  usePaymentsBasketAddDiscount,
  usePaymentsCheckoutStartCheckout,
  usePaymentsOrderHistory,
};
