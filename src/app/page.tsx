"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList, useMetaProductsList } from "@/services/ecommerce/meta/hooks";
import { styled } from "@mitodl/smoot-design";
import { Typography, Button } from "@mui/material";
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
} from "@mitodl/unified-ecommerce-api-axios/v0";

import {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
} from "@/services/ecommerce/payments/hooks";
import {
  BasketItemWithProduct,
  IntegratedSystem,
  Product,
} from "@mitodl/unified-ecommerce-api-axios/v0";

type CartProps = {
  system: string;
};

type CartBodyProps = {
  systemId: number;
  cartItems: BasketItemWithProduct[];
};

const SelectSystemContainer = styled.div`
  margin: 16px 0;
`;

const ProductListContainer = styled.div`
  margin: 16px 0;
`;

const SelectSystem: React.FC = () => {
  const systems = useMetaIntegratedSystemsList();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const router = useRouter();

  const hndSystemChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSystem(ev.target.value);
    router.push(`/?system=${ev.target.value}`);
  };

  return (
    <>
      <SelectSystemContainer>
        {systems.isFetched && systems.data ? (
          <>
            <label htmlFor="system">Select a system:</label>
            <select name="system" id="system" onChange={hndSystemChange}>
              <option value="">Select a system</option>
              {systems.data.results.map((system: IntegratedSystem) => (
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
    </>
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

const CartBody: React.FC<CartBodyProps> = ({ systemId, cartItems }) => {
  const basket = usePaymentsBasketList({
    integrated_system: systemId,
  }) as UseQueryResult<PaginatedBasketWithProductList>;
  const basketDetails = usePaymentsBasketRetrieve(
    basket.data?.results[0]?.id || 0,
    { enabled: !!basket.data?.count },
  ) as UseQueryResult<BasketWithProduct>;
  let cartItemsList = cartItems;

  // Update the basket with items from cartItemsList
  

  if (
    basketDetails.isFetched &&
    basketDetails?.data?.basket_items &&
    basketDetails.data.basket_items.length > 0
  ) {
    cartItemsList = cartItemsList.concat(
      basketDetails.data.basket_items.map(
        (item: BasketItemWithProduct) => item,
      ),
    );
  }

  return basketDetails.isFetched &&
    basketDetails?.data?.id &&
    cartItemsList.length > 0 ? (
    <CartBodyContainer>
      <CartItemsContainer>
        {cartItemsList.map((item: BasketItemWithProduct) => (
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
  const products = useMetaProductsList(selectedSystem || "");
  const [cartItems, setCartItems] = useState<BasketItemWithProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const addToCart = () => {
    if (!selectedProductId) return;

    const selectedProduct = products.data?.results.find(
      (product: Product) => product.id === selectedProductId,
    );

    if (
      selectedProduct &&
      !cartItems.some((item) => item.product.id === selectedProduct.id)
    ) {
      const basketItemWithProduct = {
        id: selectedProduct.id,
        product: selectedProduct,
        quantity: 1,
        price: selectedProduct.price,
        total: selectedProduct.price,
        product_name: selectedProduct.name,
        product_description: selectedProduct.description,
        product_image: selectedProduct.image,
      };
      setCartItems((prevItems) => [...prevItems, basketItemWithProduct]);
    }
  };

  return (
    selectedSystem &&
    products.isFetched &&
    products.data && (
      <CartContainer>
        <ProductListContainer>
          <Typography variant="h6">Products:</Typography>
          <label htmlFor="products">Select a product:</label>
          <select
            id="products"
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
          >
            <option value="">Select a product</option>
            {products.data.results.map((product: Product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <Button
            variant="contained"
            color="primary"
            onClick={addToCart}
            style={{ marginLeft: "8px" }}
          >
            Add to Cart
          </Button>
        </ProductListContainer>
        <CartHeader>
          <Typography variant="h3">
            You are about to purchase the following:
          </Typography>
        </CartHeader>
        {selectedSystem && <CartBody systemId={selectedSystem.id} cartItems={cartItems} />}
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
