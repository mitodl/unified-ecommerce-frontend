"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";
import { styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { getCurrentSystem } from "@/utils/system";
import { Card } from "@/page-components/Card/Card";

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
`;

const CartHeader = styled.h1`
  width: 100%;
  flex-grow: 1;
  margin-bottom: 16px;
`;

const CartItemsContainer = styled.div`
  width: 816px;
`;

const CartSummaryContainer = styled.div`
  width: auto;
  flex-grow: 1;
`;

const Cart = () => {
  return <CartContainer>
    <CartHeader>You are about to purchase the following:</CartHeader>
    <CartBodyContainer>
      <CartItemsContainer>
        <StyledCard>
          <Card.Content>
            <p>This is an item that's in the cart..</p>
          </Card.Content>
        </StyledCard>

        <StyledCard>
          <Card.Content>
            <p>This is an item that's in the cart..</p>
          </Card.Content>
        </StyledCard>
      </CartItemsContainer>
      <CartSummaryContainer>
        <StyledCard>
          <Card.Content>
            <Typography variant="h3">Order Summary</Typography>
            
            <p>This is an item that's in the cart..</p>
          </Card.Content>
          <Card.Footer>
            By placing my order I agree to the Terms of Service and Privacy Policy.
          </Card.Footer>
        </StyledCard>

      </CartSummaryContainer>
    </CartBodyContainer>
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
    {specifiedSystem !== "" && <Cart />
    }
  </CartPageContainer>;
};

export default Home;
