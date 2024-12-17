import React from "react";
import { styled } from "@mitodl/smoot-design";

import {
  BasketItemWithProduct,
  BasketWithProduct,
} from "@/services/ecommerce/generated/v0";

type CartSummaryItemVariant = "tax" | "item";
type CartSummaryItemTitleVariant = "" | "discount";

type CartSummaryItemProps = {
  item: BasketItemWithProduct | BasketWithProduct;
  variant?: CartSummaryItemVariant;
};

type CartSummaryItemContainerProps = {
  variant?: CartSummaryItemVariant;
};

type CartSummaryItemTitleProps = {
  variant?: CartSummaryItemTitleVariant;
};

const CartSummaryItemContainer = styled.div<CartSummaryItemContainerProps>(
  ({ variant }) => ({
    display: "flex",
    marginTop: variant === "tax" ? "16px" : "",
    marginBottom: "8px",
  }),
);

const CartSummaryItemTitle = styled.div<CartSummaryItemTitleProps>(
  ({ variant }) => ({
    width: "280px",
    marginRight: "16px",
    fontStyle: variant === "discount" ? "italic" : "",
  }),
);

const CartSummaryItemValue = styled.div`
  width: auto;
  flex-grow: 1;
  text-align: right;
`;

const isBasketWithProduct = (
  item: BasketItemWithProduct | BasketWithProduct,
): item is BasketWithProduct => {
  return (item as BasketWithProduct).tax !== undefined;
};

const CartSummaryItem: React.FC<CartSummaryItemProps> = ({ item, variant }) => {
  return (
    <>
      {isBasketWithProduct(item) && (
        <CartSummaryItemContainer variant={variant || "item"}>
          <CartSummaryItemTitle>
            {item.tax_rate.tax_rate_name}
          </CartSummaryItemTitle>
          <CartSummaryItemValue>
            {item.tax.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CartSummaryItemValue>
        </CartSummaryItemContainer>
      )}
      {!isBasketWithProduct(item) && (
        <>
          <CartSummaryItemContainer variant={variant || "item"}>
            <CartSummaryItemTitle>{item.product.name}</CartSummaryItemTitle>
            <CartSummaryItemValue>
              {item.discounted_price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </CartSummaryItemValue>
          </CartSummaryItemContainer>
          {item.discount_applied && (
            <CartSummaryItemContainer>
              <CartSummaryItemTitle variant="discount">
                Discount Applied: {item.discount_applied.discount_code}
              </CartSummaryItemTitle>
              <CartSummaryItemValue>
                -
                {(
                  parseFloat(item.product.price) - item.discounted_price
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </CartSummaryItemValue>
            </CartSummaryItemContainer>
          )}
        </>
      )}
    </>
  );
};

export default CartSummaryItem;
export { CartSummaryItemContainer, CartSummaryItemTitle, CartSummaryItemValue };
