import { BasketItemWithProduct } from "@mitodl/unified-ecommerce-api-axios/v0";
import { styled } from "@mitodl/smoot-design";
import { Card } from "../../components/Card/Card";
import { Typography, Button } from "@mui/material";

import StyledCard from "../../components/Card/StyledCard";

type CartItemProps = {
  item: BasketItemWithProduct;
  removeItem: (id: number) => void;
};

const CartItemContainer = styled.div(() => ({
  display: "flex",
  marginTop: "16px",
  marginBottom: "8px",
}));

const CartItemImage = styled.img`
  width: 192px;
  margin: 0;
`;

const CartItemContentContainer = styled.div`
  width: auto;
  flex-grow: 1;
  margin: 0;
  margin-left: 32px;
`;

const CartItemProductMeta = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: 8px;
`;

const CartItemProductPrice = styled.div`
  margin-left: auto;
  ${({ theme }) => ({ ...theme.typography.h5 })};
`;

const CartItemProductSku = styled.div`
  ${({ theme }) => ({ ...theme.typography.body1 })};
  color: ${({ theme }) => theme.custom.colors.silverGrayLight};
`;

const CartItemProductDescription = styled.div`
  margin: 8px 0;
`;

const CartItem: React.FC<CartItemProps> = ({ item, removeItem }) => {
  return (
    <StyledCard key={`ue-basket-item-${item.id}`}>
      <Card.Content>
        <CartItemContainer>
          <CartItemImage
            src="https://placecats.com/192/108"
            alt="placeholder cat"
          />

          <CartItemContentContainer>
            <CartItemProductMeta>
              <CartItemProductSku>{item.product.sku}</CartItemProductSku>
              <CartItemProductPrice>
                {parseFloat(item.product.price).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </CartItemProductPrice>
            </CartItemProductMeta>

            <Typography variant="h3">{item.product.name}</Typography>

            <CartItemProductDescription>
              {item.product.description}
            </CartItemProductDescription>
            <Button
              variant="contained"
              color="primary"
              href={item.product.details_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resource Details
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => removeItem(item.id)}
              style={{ marginLeft: "8px" }}
            >
              Remove
            </Button>
          </CartItemContentContainer>
        </CartItemContainer>
      </Card.Content>
    </StyledCard>
  );
};

export default CartItem;
