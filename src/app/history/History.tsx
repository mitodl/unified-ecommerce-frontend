"use client";
import React from "react";
import { Button, styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { UseQueryResult } from "react-query";



const OrderHistoryContainer = styled.div(() => ({
  width: "488px",
  padding: "0",
  ["> div"]: {
    padding: "32px",
  },
}));

const OrderHistory: React.FC<> = () => { 
    const history = usePaymentsOrderHistory() as UseQueryResult<PaginatedOrderHistoryList>;
  
    return (
        history.data && (
            <OrderHistoryContainer>
                <Typography variant="h4">Order History</Typography>
                {history.data.results.map((order) => (
                    <div key={order.id}>
                        <Typography variant="h6">{order.id}</Typography>
                        <Button
                            onClick={() => {
                                console.log("View Order Details", order.id);
                            }}
                        >
                            View Order Details
                        </Button>
                    </div>
                ))}
            </OrderHistoryContainer>
        )
    );
  };
  
  export default OrderHistory;