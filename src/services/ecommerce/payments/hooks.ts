import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { paymentsApi } from "../client";
import type {
  PaymentsApiPaymentsBasketsListRequest,
  PaymentsApiPaymentsBasketsCreateFromProductCreateRequest,
  PaymentsApiPaymentsBasketsAddDiscountCreateRequest,
  PaymentsApiPaymentsCheckoutCreateRequest,
} from "../generated/v0/api";

const usePaymentsBasketList = (
  options: PaymentsApiPaymentsBasketsListRequest,
) =>
  useQuery({
    queryKey: ["paymentsBaskets"],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsList(options);
      return response.data;
    },
  });

const useDeferredPaymentsBasketList = (
  options: PaymentsApiPaymentsBasketsListRequest,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ["paymentsBaskets"],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsList(options);
      return response.data;
    },
    enabled: enabled,
  });

const usePaymentsBasketRetrieve = (id: number) => {
  return useQuery({
    queryKey: ["paymentsBaskets", id],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsRetrieve({ id });
      return response.data;
    },
  });
};

const useDeferredPaymentsBasketRetrieve = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["paymentsBaskets", id],
    queryFn: async () => {
      const response = await paymentsApi.paymentsBasketsRetrieve({ id });
      return response.data;
    },
    enabled: enabled,
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
      client.invalidateQueries({ queryKey: ["paymentsBaskets"] });
    },
  });
};

const usePaymentsBasketAddDiscount = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (
      request: PaymentsApiPaymentsBasketsAddDiscountCreateRequest,
    ) =>
      paymentsApi
        .paymentsBasketsAddDiscountCreate(request)
        .then((response) => response.data),
    onSuccess: (_data) => {
      client.invalidateQueries({ queryKey: ["paymentsBaskets"] });
    },
  });
}

const usePaymentsCheckoutStartCheckout = () => {
  return useMutation({
    mutationFn: (
      request: PaymentsApiPaymentsCheckoutCreateRequest,
    ) =>
      paymentsApi
        .paymentsCheckoutCreate(request)
        .then((response) => response.data),
  });
}

export {
  usePaymentsBasketList,
  useDeferredPaymentsBasketList,
  usePaymentsBasketRetrieve,
  useDeferredPaymentsBasketRetrieve,
  usePaymentsBaksetCreateFromProduct,
  usePaymentsBasketAddDiscount,
  usePaymentsCheckoutStartCheckout,
};
