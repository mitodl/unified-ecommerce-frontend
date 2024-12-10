"use client";
import React from "react";
import { Button, styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { createTheme } from "@mitodl/smoot-design"
import { InputBase as Input } from "@mui/material";
import { Card } from "../Card/Card";
import StyledCard from "../Card/StyledCard";
import CartSummaryItem, { CartSummaryItemContainer, CartSummaryItemTitle, CartSummaryItemValue } from "../CartSummaryItem/CartSummaryItem";

import {
  usePaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";

type CartSummaryProps = {
  cartId: number;
}
  
const theme = createTheme();

const CartSummaryContainer = styled.div(() => ({
    "width": "488px",
    "padding": "0",
    ["> div"]: {
      "padding": "32px",
    },
  }));
      
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
  
const CartSummary: React.FC<CartSummaryProps> = (props) => {
    const { cartId } = props;
    const basket = usePaymentsBasketRetrieve(cartId);

    return basket.data && <CartSummaryContainer>
    <StyledCard>
      <Card.Content>
        <Typography variant="h3">Order Summary</Typography>
        
        <CartSummaryReceiptContainer>
          { basket.data.basket_items.map((item) => (
            <CartSummaryItem key={`ue-basket-item-${item.id}`} item={item} />))
          }

          { basket.data.tax_rate && <CartSummaryItem variant="tax" item={basket.data} /> }
        </CartSummaryReceiptContainer>

        <CartSummaryTotalContainer>
          <CartSummaryItemContainer>
            <CartSummaryItemTitle>Total</CartSummaryItemTitle>
            <CartSummaryItemValue>{basket.data.total_price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</CartSummaryItemValue>
          </CartSummaryItemContainer>
        </CartSummaryTotalContainer>

        <CartSummaryDiscountContainer>
            <label htmlFor="discountcode">Coupon Code</label>
            <CartSummaryItemContainer>
              <CartSummaryItemTitle>
                <Input size="small" name="discountcode" type="text" />
              </CartSummaryItemTitle>
              <CartSummaryItemValue>
                <Button variant="unstable_inverted">Apply</Button>
              </CartSummaryItemValue>
            </CartSummaryItemContainer>
        </CartSummaryDiscountContainer>

        <CartSummaryActionContainer>
          <CartPayButton size="large">Place Order</CartPayButton>
        </CartSummaryActionContainer>

        <CartSummaryTermsContainer>
          By placing my order, I agree to the Terms of Service and Privacy Policy.
        </CartSummaryTermsContainer>

      </Card.Content>
    </StyledCard>
  </CartSummaryContainer>;
}

export default CartSummary;