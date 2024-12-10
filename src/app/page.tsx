"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";
import { Button, styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { getCurrentSystem } from "@/utils/system";
import { Card } from "@/page-components/Card/Card";
import { createTheme } from "@mitodl/smoot-design"
import { InputBase as Input } from "@mui/material";

import {
  usePaymentsBasketList,
  useDeferredPaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";
import {
  IntegratedSystem,
  PaymentsApiPaymentsBasketsListRequest,
} from "@/services/ecommerce/generated/v0";

type CartProps = {
  system: string;
}

type CartBodyProps = {
  systemId: number;
}

const theme = createTheme();

const CartPageContainer = styled.div`
  margin: 64px 108px;
`

const StyledCard = styled(Card)`
  padding: 32px;
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
  }

  return <SelectSystemContainer>
    {systems.isFetched && systems.data ? <>
    <label htmlFor="system">Select a system:</label>
    <select name="system" id="system" onChange={hndSystemChange}>
      <option value="">Select a system</option>
      {systems.data.results.map((system) => (
        <option key={system.id} value={system.slug || ""}>
          {system.name}
        </option>
      ))}
    </select></> : <p>Loading systems...</p>}
  </SelectSystemContainer>;
}

const CartContainer = styled.div`
`;

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

type CartSummaryItemProps = {
  variant?: string;
}

const CartSummaryContainer = styled.div(() => ({
  "width": "488px",
  "padding": "0",
  ["> div"]: {
    "padding": "32px",
  },
}));


const CartSummaryItem = styled.div<CartSummaryItemProps>(({ variant }) => ({
  "display": "flex",
  "marginTop": (variant === "tax" ? "16px" : ""),
  "marginBottom": "8px",
}));

const CartSummaryItemTitle = styled.div`
  width: 280px;
  margin-right: 16px;
`;

const CartSummaryItemValue = styled.div`
  width: auto;
  flex-grow: 1;
  text-align: right;
`;

const CartSummaryReceiptContainer = styled.div(() => ({
  "borderBottom": "1px solid #DDE1E6",
  "padding": "8px 0",
  "margin": "8px 0",
  "width": "100%"
}));

const CartSummaryTotalContainer = styled.div`
 ${{ ...theme.typography.h5 }},
 margin-bottom: 20px;
 margin-top: 8px;
`;

const CartSummaryActionContainer = styled.div`
  margin: 20px 0;
`;

const CartSummaryTermsContainer = styled.div`
  margin: 20px 0;
`;

const CartSummaryDiscountContainer = styled.div`
  margin-top: 20px;
`;

const CartPayButton = styled(Button)`
  width: 100%;
`;

const CartBody: React.FC<CartBodyProps> = ({ systemId }) => {
  const basket = usePaymentsBasketList({ integrated_system: systemId });
  const basketDetails = useDeferredPaymentsBasketRetrieve(
    basket.data?.results[0]?.id || 0,
    !!basket.data?.count,
  );

  return basketDetails.isFetched && basketDetails?.data?.basket_items && basketDetails.data.basket_items.length > 0 ? <CartBodyContainer>
    <CartItemsContainer>
      { basketDetails.data.basket_items.map((item) => (
        <StyledCard key={`ue-basket-item-${item.id}`}>
          <Card.Content>
            <Typography variant="h5">{item.product.sku}</Typography>
            <Typography variant="h3">{item.product.name}</Typography>

            <div>
              {item.product.description}
            </div>
          </Card.Content>
        </StyledCard>)) }

    </CartItemsContainer>
    <CartSummaryContainer>
      <StyledCard>
        <Card.Content>
          <Typography variant="h3">Order Summary</Typography>
          
          <CartSummaryReceiptContainer>
            { basketDetails.data.basket_items.map((item) => (
              <CartSummaryItem key={`ue-basket-item-${item.id}`}>
                <CartSummaryItemTitle>{item.product.name}</CartSummaryItemTitle>
                <CartSummaryItemValue>{item.discounted_price.toLocaleString("en-US", { style: "currency", currency: "USD"})}</CartSummaryItemValue>
              </CartSummaryItem>)) }


            { basketDetails.data.tax_rate ? <CartSummaryItem variant="tax">
                <CartSummaryItemTitle>{basketDetails.data.tax_rate.tax_rate_name}</CartSummaryItemTitle>
                <CartSummaryItemValue>{basketDetails.data.tax.toLocaleString("en-US", { style: "currency", currency: "USD" })}</CartSummaryItemValue>
              </CartSummaryItem> : null }
          </CartSummaryReceiptContainer>

          <CartSummaryTotalContainer>
            <CartSummaryItem>
              <CartSummaryItemTitle>Total</CartSummaryItemTitle>
              <CartSummaryItemValue>{basketDetails.data.total_price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</CartSummaryItemValue>
            </CartSummaryItem>
          </CartSummaryTotalContainer>

          <CartSummaryDiscountContainer>
              <label htmlFor="discountcode">Coupon Code</label>
              <CartSummaryItem>
                <CartSummaryItemTitle>
                  <Input size="small" name="discountcode" type="text" />
                </CartSummaryItemTitle>
                <CartSummaryItemValue>
                  <Button variant="unstable_inverted">Apply</Button>
                </CartSummaryItemValue>
              </CartSummaryItem>
          </CartSummaryDiscountContainer>

          <CartSummaryActionContainer>
            <CartPayButton size="large">Place Order</CartPayButton>
          </CartSummaryActionContainer>

          <CartSummaryTermsContainer>
            By placing my order, I agree to the Terms of Service and Privacy Policy.
          </CartSummaryTermsContainer>

        </Card.Content>
      </StyledCard>

    </CartSummaryContainer>
  </CartBodyContainer> : <CartBodyContainer>
      <StyledCard>
        <Card.Content>
          <p>Your cart is empty.</p>
        </Card.Content>
      </StyledCard>
    </CartBodyContainer>
}

const Cart: React.FC<CartProps> = ({ system }) => {
  const systems = useMetaIntegratedSystemsList();
  const [ selectedSystem, setSelectedSystem ] = useState<number | null>(null);

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
  }, [ system, systems, selectedSystem ]);

  return <CartContainer>
    <CartHeader>
      <Typography variant="h3">You are about to purchase the following:</Typography>
    </CartHeader>
    {selectedSystem && <CartBody systemId={selectedSystem} />}
  </CartContainer>
}

const Home = () => {
  const searchParams = useSearchParams();
  const specifiedSystem = getCurrentSystem(searchParams);

  return <CartPageContainer>
    {specifiedSystem === "" && <StyledCard>
      <Card.Content>
        We can't determine what system you're trying to access. Please choose a system to continue.

        <SelectSystem />
      </Card.Content>
    </StyledCard>}
    {specifiedSystem !== "" && <Cart system={specifiedSystem} />
    }
  </CartPageContainer>;
};

export default Home;
