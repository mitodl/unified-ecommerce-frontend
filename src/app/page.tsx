"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useMetaIntegratedSystemsList,
  useMetaProductsList,
} from "@/services/ecommerce/meta/hooks";
import { styled, Button } from "@mitodl/smoot-design";
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
} from "@mitodl/unified-ecommerce-api-axios/v0";

import {
  usePaymentsBasketList,
  usePaymentsBasketRetrieve,
  usePaymentsBasketCreateFromProduct,
  usePaymentsBasketitemsDestroy,
  usePaymentsBasketsClearDestroy,
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
};

const SelectSystemContainer = styled.div`
  margin: 16px 0;
`;

const ProductListContainer = styled.div`
  margin: 16px 0;
`;

const SelectSystem: React.FC = () => {
  const systems = useMetaIntegratedSystemsList();
  const router = useRouter();
  const [_selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const hndSystemChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSystem(ev.target.value);
    router.push(`/?system=${ev.target.value}`);
  };

  return (
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

const CartBody: React.FC<CartBodyProps & { refreshKey: number, setRefreshKey: (refreshKey: number) => void;}> = ({
  systemId,
  refreshKey,
  setRefreshKey,
}) => {
  const basket = usePaymentsBasketList({
    integrated_system: systemId,
  }) as UseQueryResult<PaginatedBasketWithProductList>;
  const basketDetails = usePaymentsBasketRetrieve(
    basket.data?.results[0]?.id || 0,
    {
      enabled: !!basket.data?.count,
      queryKey: ["basketDetails", systemId, refreshKey], // Add refreshKey to query key
    },
  ) as UseQueryResult<BasketWithProduct>;

  // remove item from basket
  const removeItem = usePaymentsBasketitemsDestroy();

  const handleRemoveItem = async (id: number) => {
    try {
      await removeItem.mutateAsync(id);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  return basketDetails.isFetched &&
    basketDetails?.data?.id &&
    basketDetails.data.basket_items.length > 0 ? (
    <CartBodyContainer>
      <CartItemsContainer>
        {basketDetails.data.basket_items.map((item: BasketItemWithProduct) => (
          <CartItem item={item} removeItem={handleRemoveItem} key={`ue-basket-item-${item.id}`}>
          </CartItem>
        ))}
      </CartItemsContainer>
      <CartSummary cartId={basketDetails.data.id} refreshKey={refreshKey} />
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
  const products = useMetaProductsList(system || "");
  const createBasketFromProduct = usePaymentsBasketCreateFromProduct();
  const clearBasket = usePaymentsBasketsClearDestroy();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const addToCart = async () => {
    const selectedProduct =
      products &&
      products.data &&
      products.data.results.find(
        (product: Product) => product.id === selectedProductId,
      );

    if (!selectedProduct) {
      return;
    }

    try {
      const response = await createBasketFromProduct.mutateAsync({
        sku: selectedProduct.sku,
        system_slug: selectedSystem?.slug ?? "",
      });

      if (response && response.id) {
        setRefreshKey((prev) => prev + 1); // Increment refreshKey to trigger updates
      }
    } catch (error) {
      console.error("Failed to add product to cart", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearBasket.mutateAsync({system_slug: selectedSystem?.slug ?? "",});
      setRefreshKey((prev) => prev + 1); // Trigger a basket reload after clearing
      console.log("Cart cleared successfully.");
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  console.log(selectedSystem);

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
            {products.data.results.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <Button onClick={addToCart} style={{ marginLeft: "8px" }}>
            Add to Cart
          </Button>
        </ProductListContainer>
        <CartHeader>
          <Typography variant="h3">
            You are about to purchase the following:
          </Typography>
        </CartHeader>
        {selectedSystem && (
          <CartBody systemId={selectedSystem.id} refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearCart}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          Clear Cart
        </Button>
        {selectedSystem && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = selectedSystem.homepage_url}
            style={{ marginLeft: "10px" ,marginTop: "20px", marginBottom: "20px" }}
          >
            Back to {selectedSystem.name}
          </Button>
        )}
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
