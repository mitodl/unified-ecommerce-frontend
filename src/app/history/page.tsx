"use client";
import React, { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Button, styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { UseQueryResult } from "react-query";
import { PaginatedOrderHistoryList } from "@/services/ecommerce/payments/types";
import { usePaymentsOrderHistory } from "@/services/ecommerce/payments/hooks";

const OrderHistoryContainer = styled.div(() => ({
  width: "100%",
  padding: "0",
  ["> div"]: {
    padding: "32px",
  },
}));

const OrderHistory: React.FC = () => {
  const history = usePaymentsOrderHistory() as UseQueryResult<PaginatedOrderHistoryList>;

  const data = useMemo(() => history.data?.results || [], [history.data]);

  const columns = useMemo(
    () => [
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Reference Number",
        accessor: "reference_number",
      },
      {
        Header: "Number of Products",
        accessor: (row) => row.lines.length,
      },
      {
        Header: "Integrated System (First Product)",
        accessor: (row) => row.lines[0]?.product[0]?.system || "N/A",
      },
      {
        Header: "Total Price Paid",
        accessor: "total_price_paid",
      },
      {
        Header: "Created On",
        accessor: "created_on",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    history.data && (
      <OrderHistoryContainer>
        <Typography variant="h4">Order History</Typography>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </OrderHistoryContainer>
    )
  );
};

export default OrderHistory;