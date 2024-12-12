"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";
import { styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { getCurrentSystem } from "@/utils/system";
import { Card } from "@/page-components/Card/Card";
import CartItem from "@/page-components/CartItem/CartItem";
import CartSummary from "@/page-components/CartSummary/CartSummary";
import StyledCard from "@/page-components/Card/StyledCard";

import {
  usePaymentsBasketList,
  useDeferredPaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";
import { IntegratedSystem } from "@/services/ecommerce/generated/v0";

type CartProps = {
  system: string;
};

type CartBodyProps = {
  systemId: number;
};

const CartPageContainer = styled.div`
  margin: 64px 108px;
`;

const SelectSystemContainer = styled.div`
  margin: 16px 0;
`;

const SelectSystem: React.FC = () => {
  const systems = useMetaIntegratedSystemsList();
  const router = useRouter();

  const hndSystemChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(ev.target.value);

    router.push(`/?system=${ev.target.value}`);
  };

  return (
    <SelectSystemContainer>
      {systems.isFetched && systems.data ? (
        <>
          <label htmlFor="system">Select a system:</label>
          <select name="system" id="system" onChange={hndSystemChange}>
            <option value="">Select a system</option>
            {systems.data.results.map((system) => (
              <option key={system.id} value={system.slug || ""}>
                {system.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>Loading systems...</p>
      )}
    </SelectSystemContainer>
  );
};

const CartContainer = styled.div``;

const CartBodyContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 48px;
  align-items: start;
`;

const CartHeader = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-bottom: 16px;
`;

const CartItemsContainer = styled.div`
  width: auto;
  flex-grow: 1;
`;

const CartBody: React.FC<CartBodyProps> = ({ systemId }) => {
  const basket = usePaymentsBasketList({ integrated_system: systemId });
  const basketDetails = useDeferredPaymentsBasketRetrieve(
    basket.data?.results[0]?.id || 0,
    !!basket.data?.count,
  );

  return basketDetails.isFetched &&
    basketDetails?.data?.basket_items &&
    basketDetails.data.basket_items.length > 0 ? (
    <CartBodyContainer>
      <CartItemsContainer>
        {basketDetails.data.basket_items.map((item) => (
          <CartItem item={item} key={`ue-basket-item-${item.id}`} />
        ))}
      </CartItemsContainer>
      <CartSummary cartId={basketDetails.data.id} />
    </CartBodyContainer>
  ) : (
    <CartBodyContainer>
      <StyledCard>
        <Card.Content>
          <p>Your cart is empty.</p>
        </Card.Content>
      </StyledCard>
    </CartBodyContainer>
  );
};

const Cart: React.FC<CartProps> = ({ system }) => {
  const systems = useMetaIntegratedSystemsList();
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);

  useEffect(() => {
    if (system && systems.data) {
      const foundSystem = systems.data.results.find(
        (integratedSystem: IntegratedSystem) =>
          integratedSystem.slug === system,
      );

      if (foundSystem) {
        console.log("we found a system", foundSystem);
        setSelectedSystem(foundSystem.id);
      }
    }
  }, [system, systems, selectedSystem]);

  return (
    <CartContainer>
      <CartHeader>
        <Typography variant="h3">
          You are about to purchase the following:
        </Typography>
      </CartHeader>
      {selectedSystem && <CartBody systemId={selectedSystem} />}
    </CartContainer>
  );
};

const Home = () => {
  const searchParams = useSearchParams();
  const specifiedSystem = getCurrentSystem(searchParams);

  return (
    <CartPageContainer>
      {specifiedSystem === "" && (
        <StyledCard>
          <Card.Content>
            We can't determine what system you're trying to access. Please
            choose a system to continue.
            <SelectSystem />
          </Card.Content>
        </StyledCard>
      )}
      {specifiedSystem !== "" && <Cart system={specifiedSystem} />}
    </CartPageContainer>
  );
};

export default Home;
