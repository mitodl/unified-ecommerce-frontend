import { BasketItemWithProduct } from "@/services/ecommerce/generated/v0";
import { styled } from "@mitodl/smoot-design";
import { Card } from "../Card/Card";
import { createTheme } from "@mitodl/smoot-design"
import { Typography } from "@mui/material";

import StyledCard from "../Card/StyledCard";

const theme = createTheme();

type CartItemProps = {
    item: BasketItemWithProduct;
}

const CartItemContainer = styled.div(() => ({
    "display": "flex",
    "marginTop": "16px",
    "marginBottom": "8px",
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
    ${{ ...theme.typography.h5 }},
`;

const CartItemProductSku = styled.div`
    ${{ ...theme.typography.body1 }},
    color: ${ theme.custom.colors.silverGrayLight },
`;

const CartItemProductDescription = styled.div`
    margin: 8px 0;
`;

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    return <StyledCard key={`ue-basket-item-${item.id}`}>
        <Card.Content>
            <CartItemContainer>
                <CartItemImage src="https://placecats.com/192/108" alt="placeholder cat" />

                <CartItemContentContainer>
                    <CartItemProductMeta>
                        <CartItemProductSku>{item.product.sku}</CartItemProductSku>
                        <CartItemProductPrice>{parseFloat(item.product.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</CartItemProductPrice>
                    </CartItemProductMeta>

                    <Typography variant="h3">{item.product.name}</Typography>

                    <CartItemProductDescription>
                        {item.product.description}
                    </CartItemProductDescription>
                </CartItemContentContainer>
            </CartItemContainer>
        </Card.Content>
    </StyledCard>;
};

export default CartItem;

