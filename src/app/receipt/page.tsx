"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePayementsOrdersHistoryRetrieve } from "@/services/ecommerce/payments/hooks";
import { Button, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";

const Receipt: React.FC = () => {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");
  const orderId = orderParam ? Number(orderParam) : null;

  const {
    mutateAsync: fetchOrder,
    data: order,
    isLoading,
    error,
  } = usePayementsOrdersHistoryRetrieve();

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (orderId !== null && !hasFetched) {
      setHasFetched(true);
      const fetchOrderHistory = async () => {
        try {
          await fetchOrder(orderId);
        } catch (err) {
          console.error("Failed to retrieve order receipt", err);
        }
      };

      fetchOrderHistory();
    }
  }, [orderId, hasFetched, fetchOrder]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading order. Please try again later.</Typography>;
  if (!order) return <Typography>No order information available.</Typography>;

  const { state, reference_number: referenceNumber, total_price_paid: totalPricePaid, lines, transactions, created_on: createdOn, updated_on: updatedOn, discounts_applied } = order;
  const transaction = transactions.length > 0 ? transactions[0] : null;

  const subtotal = lines.reduce((acc, line) => acc + Number(line.total_price), 0);
  const totalTax = transaction?.data?.req_tax_amount ? Number(transaction.data.req_tax_amount) : 0;
  const totalDiscount = discounts_applied.reduce((acc, discount) => acc + Number(discount.amount), 0);
  const grandTotal = subtotal + totalTax - totalDiscount;

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 3, backgroundColor: "#fff" }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Typography variant="h5">Receipt</Typography>
          <Button variant="contained" color="primary" onClick={handlePrint}>Print</Button>
        </div>
        
        <div id="printable-area">
          <Typography variant="h6">Order Details</Typography>
          <Typography><strong>Reference Number:</strong> {referenceNumber}</Typography>
          <Typography><strong>State:</strong> {state}</Typography>
          <Typography><strong>Total Price Paid:</strong> ${Number(totalPricePaid).toFixed(2)}</Typography>
          <Typography><strong>Created On:</strong> {new Date(createdOn).toLocaleString()}</Typography>
          <Typography><strong>Last Updated:</strong> {new Date(updatedOn).toLocaleString()}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>Purchased Items</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item Description</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Unit Price</strong></TableCell>
                <TableCell><strong>Total Price</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.item_description}</TableCell>
                  <TableCell>{line.product?.name}</TableCell>
                  <TableCell>{line.product?.sku}</TableCell>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>${Number(line.unit_price).toFixed(2)}</TableCell>
                  <TableCell>${Number(line.total_price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={8}>
              {transaction && (
                <>
                  <Typography variant="subtitle1">Transaction Details</Typography>
                  <Typography>Transaction ID: {transaction.transaction_id}</Typography>
                  <Typography>Transaction Type: {transaction.transaction_type}</Typography>
                  <Typography>Amount: ${Number(transaction.amount).toFixed(2)}</Typography>
                  <Typography>Payment Method: {transaction.data.card_type_name}</Typography>
                  <Typography>Card Number: {transaction.data.req_card_number}</Typography>
                  <Typography>Auth Code: {transaction.data.auth_code}</Typography>
                  <Typography>Transaction Time: {new Date(transaction.created_on).toLocaleString()}</Typography>
                </>
              )}
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Order Summary</Typography>
              <Typography><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</Typography>
              <Typography><strong>Total Tax:</strong> ${totalTax.toFixed(2)}</Typography>
              <Typography><strong>Total Discount:</strong> -${totalDiscount.toFixed(2)}</Typography>
              <Typography><strong>Grand Total:</strong> ${grandTotal.toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};

export default Receipt;
