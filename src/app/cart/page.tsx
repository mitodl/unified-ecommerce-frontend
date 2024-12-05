"use client";
import { useEffect, useState } from "react";
import { getCurrentSystem } from "@/utils/system";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";
import {
  useDeferredPaymentsBasketList,
  useDeferredPaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";
import {
  IntegratedSystem,
  PaymentsApiPaymentsBasketsListRequest,
} from "@/services/ecommerce/generated/v0";

const Cart = () => {
  const [selectedSystem, setSelectedSystem] =
    useState<PaymentsApiPaymentsBasketsListRequest | null>(null);
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null);
  const system = getCurrentSystem();

  const integratedSystems = useMetaIntegratedSystemsList();
  const basket = useDeferredPaymentsBasketList(
    selectedSystem || {},
    !!selectedSystem,
  );
  const basketDetails = useDeferredPaymentsBasketRetrieve(
    selectedBasket || 0,
    !!selectedBasket,
  );

  useEffect(() => {
    if (system && integratedSystems.isFetched && integratedSystems.data) {
      const systemId = integratedSystems.data.results.find(
        (integratedSystem: IntegratedSystem) =>
          integratedSystem.slug === system,
      )?.id;

      if (systemId) {
        setSelectedSystem({ integrated_system: systemId });
      }
    }
  }, [system, integratedSystems]);

  useEffect(() => {
    if (basket.isFetched && basket.data) {
      setSelectedBasket(basket.data.results[0].id);
    }
  }, [basket]);

  return (
    <div>
      <h1>Cart</h1>

      <p>You're looking at the cart for system {system}.</p>

      {(basket.isLoading || basketDetails.isLoading) && <p>Loading...</p>}
      {basketDetails.isFetched && basketDetails.data && (
        <>
          <p>Basket!</p>

          <pre>{JSON.stringify(basketDetails.data)}</pre>
        </>
      )}
    </div>
  );
};

export default Cart;
