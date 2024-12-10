import React from "react";
import { styled } from "@mitodl/smoot-design";

import { BasketItemWithProduct, BasketWithProduct } from "@/services/ecommerce/generated/v0";

type CartSummaryItemVariant = "tax" | "item";

type CartSummaryItemProps = {
  item: BasketItemWithProduct | BasketWithProduct;
  variant?: CartSummaryItemVariant;
}

type CartSummaryItemContainerProps = {
    variant?: CartSummaryItemVariant;
} 
  
const CartSummaryItemContainer = styled.div<CartSummaryItemContainerProps>(({ variant }) => ({
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

const isBasketWithProduct = (item: BasketItemWithProduct | BasketWithProduct): item is BasketWithProduct => {
    return (item as BasketWithProduct).tax !== undefined;
};

const CartSummaryItem: React.FC<CartSummaryItemProps> = ({ item, variant }) => {
    return <CartSummaryItemContainer variant={variant || "item"}>
        {isBasketWithProduct(item) ? <>
            <CartSummaryItemTitle>{item.tax_rate.tax_rate_name}</CartSummaryItemTitle>
            <CartSummaryItemValue>{item.tax.toLocaleString("en-US", { style: "currency", currency: "USD" })}</CartSummaryItemValue>
        </> : null}
        {!isBasketWithProduct(item) && <>
            <CartSummaryItemTitle>{item.product.name}</CartSummaryItemTitle>
            <CartSummaryItemValue>{item.discounted_price.toLocaleString("en-US", { style: "currency", currency: "USD"})}</CartSummaryItemValue>
        </>}
    </CartSummaryItemContainer>
};

export default CartSummaryItem;
export { CartSummaryItemContainer, CartSummaryItemTitle, CartSummaryItemValue };
