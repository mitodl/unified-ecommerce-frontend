"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";
import { styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { getCurrentSystem } from "@/utils/system";
import { Card } from "@/components/Card/Card";
import CartItem from "@/page-components/CartItem/CartItem";
import CartSummary from "@/page-components/CartSummary/CartSummary";
import StyledCard from "@/components/Card/StyledCard";
import { UseQueryResult } from "@tanstack/react-query";
import type {
  PaginatedBasketWithProductList,
  BasketWithProduct,
} from "@/services/ecommerce/generated/v0";

import {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";
import {
  BasketItemWithProduct,
  IntegratedSystem,
} from "@/services/ecommerce/generated/v0";

type CartProps = {
  system: string;
};

type CartBodyProps = {
  systemId: number;
};

const SelectSystemContainer = styled.div`
  margin: 16px 0;
`;

const SelectSystem: React.FC = () => {
  const systems = useMetaIntegratedSystemsList();
  const router = useRouter();

  const hndSystemChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
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
  const basket = usePaymentsBasketList({
    integrated_system: systemId,
  }) as UseQueryResult<PaginatedBasketWithProductList>;
  const basketDetails = usePaymentsBasketRetrieve(
    basket.data?.results[0]?.id || 0,
    { enabled: !!basket.data?.count },
  ) as UseQueryResult<BasketWithProduct>;

  return basketDetails.isFetched &&
    basketDetails?.data?.basket_items &&
    basketDetails.data.basket_items.length > 0 ? (
    <CartBodyContainer>
      <CartItemsContainer>
        {basketDetails.data.basket_items.map((item: BasketItemWithProduct) => (
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
  const selectedSystem = systems.data?.results.find(
    (integratedSystem: IntegratedSystem) => integratedSystem.slug === system,
  );

  return (
    selectedSystem && (
      <CartContainer>
        <CartHeader>
          <Typography variant="h3">
            You are about to purchase the following:
          </Typography>
        </CartHeader>
        {selectedSystem && <CartBody systemId={selectedSystem.id} />}
      </CartContainer>
    )
  );
};

const Home = () => {
  const searchParams = useSearchParams();
  const specifiedSystem = getCurrentSystem(searchParams);

  return (
    <Container>
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
    </Container>
  );
};

export default Home;
