"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [system, setSystem] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] =
    useState<PaymentsApiPaymentsBasketsListRequest | null>(null);
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null);
  const searchParams = useSearchParams();

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
    if (searchParams.has("system")) {
      setSystem(searchParams.get("system"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (system && integratedSystems.data) {
      const systemId = integratedSystems.data.results.find(
        (integratedSystem: IntegratedSystem) =>
          integratedSystem.slug === system,
      )?.id;

      if (systemId) {
        setSelectedSystem({ integrated_system: systemId });
      }
    }
  }, [system, selectedSystem, integratedSystems]);

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
