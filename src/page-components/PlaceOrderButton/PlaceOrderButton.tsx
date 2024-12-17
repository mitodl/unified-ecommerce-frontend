import React from "react";
import { Button, styled } from "@mitodl/smoot-design";
import { usePaymentsCheckoutStartCheckout } from "@/services/ecommerce/payments/hooks";

type PlaceOrderButtonProps = {
  systemSlug: string;
};

const CartPayButton = styled(Button)`
  width: 100%;
`;

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({ systemSlug }) => {
  const checkoutMutation = usePaymentsCheckoutStartCheckout();

  const handleClick = async () => {
    const checkout = await checkoutMutation.mutateAsync({
      system_slug: systemSlug,
    });

    // Construct the form based on the data we got back, then submit it.

    console.log("checkout", checkout);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkout.url;

    Object.getOwnPropertyNames(checkout.payload).forEach((propName: string) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = propName;
      input.value = checkout.payload[propName];

      form.appendChild(input);
    });

    document.body.appendChild(form);
    console.log(form);
    form.submit();
  };

  return <CartPayButton onClick={handleClick}>Place Order</CartPayButton>;
};

export default PlaceOrderButton;
