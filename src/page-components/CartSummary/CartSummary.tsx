"use client";
import React from "react";
import { Button, styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { createTheme } from "@mitodl/smoot-design";
import { InputBase as Input } from "@mui/material";
import { Card } from "../../components/Card/Card";
import StyledCard from "../../components/Card/StyledCard";
import CartSummaryItem, {
  CartSummaryItemContainer,
  CartSummaryItemTitle,
  CartSummaryItemValue,
} from "../CartSummaryItem/CartSummaryItem";
import PlaceOrderButton from "../PlaceOrderButton/PlaceOrderButton";

import {
  usePaymentsBasketRetrieve,
  usePaymentsBasketAddDiscount,
} from "@/services/ecommerce/payments/hooks";
import { UseQueryResult } from "@tanstack/react-query";
import { BasketWithProduct } from "@/services/ecommerce/generated/v0";

type CartSummaryProps = {
  cartId: number;
};

type CartSummaryDiscountProps = {
  systemSlug: string;
};

const theme = createTheme();

const CartSummaryContainer = styled.div(() => ({
  width: "488px",
  padding: "0",
  ["> div"]: {
    padding: "32px",
  },
}));

const CartSummaryReceiptContainer = styled.div(() => ({
  borderBottom: "1px solid #DDE1E6",
  padding: "8px 0",
  margin: "8px 0",
  width: "100%",
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

const CartSummaryDiscount: React.FC<CartSummaryDiscountProps> = ({
  systemSlug,
}) => {
  const discountMutation = usePaymentsBasketAddDiscount();
  const [discountCode, setDiscountCode] = React.useState<string>("");

  const hndUpdateCode = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(ev.target.value);
  };

  const hndApplyDiscount = () => {
    discountMutation.mutate({
      system_slug: systemSlug,
      discount_code: discountCode,
    });
  };

  return (
    <CartSummaryDiscountContainer>
      <label htmlFor="discountcode">Coupon Code</label>
      <CartSummaryItemContainer>
        <CartSummaryItemTitle>
          <Input
            size="small"
            name="discountcode"
            type="text"
            onChange={hndUpdateCode}
            error={discountMutation.isError}
          />
          {discountMutation.isError && (
            <Typography variant="caption" color="error">
              Invalid discount code
            </Typography>
          )}
        </CartSummaryItemTitle>
        <CartSummaryItemValue>
          <Button variant="unstable_inverted" onClick={hndApplyDiscount}>
            Apply
          </Button>
        </CartSummaryItemValue>
      </CartSummaryItemContainer>
    </CartSummaryDiscountContainer>
  );
};

const CartSummary: React.FC<CartSummaryProps> = (props) => {
  const { cartId } = props;
  const basket = usePaymentsBasketRetrieve(
    cartId,
  ) as UseQueryResult<BasketWithProduct>;

  return (
    basket.data && (
      <CartSummaryContainer>
        <StyledCard>
          <Card.Content>
            <Typography variant="h3">Order Summary</Typography>

            <CartSummaryReceiptContainer>
              {basket.data.basket_items.map((item) => (
                <CartSummaryItem
                  key={`ue-basket-item-${item.id}`}
                  item={item}
                />
              ))}

              {basket.data.tax_rate && (
                <CartSummaryItem variant="tax" item={basket.data} />
              )}
            </CartSummaryReceiptContainer>

            <CartSummaryTotalContainer>
              <CartSummaryItemContainer>
                <CartSummaryItemTitle>Total</CartSummaryItemTitle>
                <CartSummaryItemValue>
                  {basket.data.total_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </CartSummaryItemValue>
              </CartSummaryItemContainer>
            </CartSummaryTotalContainer>

            {basket.data.integrated_system.slug && (
              <CartSummaryDiscount
                systemSlug={basket.data.integrated_system.slug}
              />
            )}

            <CartSummaryActionContainer>
              {basket.data.integrated_system.slug && (
                <PlaceOrderButton
                  systemSlug={basket.data.integrated_system.slug}
                />
              )}
            </CartSummaryActionContainer>

            <CartSummaryTermsContainer>
              By placing my order, I agree to the Terms of Service and Privacy
              Policy.
            </CartSummaryTermsContainer>
          </Card.Content>
        </StyledCard>
      </CartSummaryContainer>
    )
  );
};

export default CartSummary;
