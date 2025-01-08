"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  Column,
  CellContext,
} from "@tanstack/react-table";
import { styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getCurrentSystem, getCurrentStatus } from "@/utils/system";
import type {
  PaginatedOrderHistoryList,
  OrderHistory,
} from "@/services/ecommerce/generated/v0";
import { usePaymentsOrderHistory } from "@/services/ecommerce/payments/hooks";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";

const OrderHistoryContainer = styled.div(() => ({
  width: "100%",
  padding: "32px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
}));

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

const StyledTh = styled.th`
  padding: 12px 16px;
  background-color: #f1f1f1;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
`;

const StyledTd = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
`;

const FilterTd = styled.td`
  padding: 8px 16px;
  background-color: #f9f9f9;
`;

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  [key: string]: unknown;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

interface FilterProps<TData> {
  column: Column<TData, unknown>;
}

const Filter = <TData,>({ column }: FilterProps<TData>) => {
  const columnFilterValue = column.getFilterValue() as string | undefined;
  return (
    <DebouncedInput
      type="text"
      value={columnFilterValue ?? ""}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={"Search..."}
      className="w-36 border shadow rounded"
    />
  );
};

const OrderHistory: React.FC = () => {
  const history =
    usePaymentsOrderHistory() as UseQueryResult<PaginatedOrderHistoryList>;
  const integratedSystemList = useMetaIntegratedSystemsList();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const data = useMemo(() => {
    if (!history.data) return [];
    const specifiedSystem = getCurrentSystem(searchParams);
    const specifiedStatus = getCurrentStatus(searchParams);
    return history.data.results.filter((row) => {
      const system = String(row.lines[0]?.product.system);
      const status = row.state;
      return (
        (specifiedSystem ? system === specifiedSystem : true) &&
        (specifiedStatus ? status === specifiedStatus : true)
      );
    });
  }, [history.data, searchParams]);

  const columns = useMemo(
    () => [
      {
        header: "Status",
        accessorKey: "state",
        enableSorting: true,
        enableFiltering: true,
        cell: (info: CellContext<OrderHistory, unknown>) => info.getValue(),
      },
      {
        header: "Reference Number",
        accessorKey: "reference_number",
        enableSorting: true,
        enableFiltering: true,
      },
      {
        header: "Number of Products",
        accessorFn: (row: OrderHistory) => row.lines.length,
      },
      {
        header: "System",
        accessorFn: (row: OrderHistory) => {
          const systemId = row.lines[0]?.product.system;
          const system = integratedSystemList.data?.results.find(
            (sys) => sys.id === systemId,
          );
          return system ? system.name : "N/A";
        },
        enableFiltering: true,
      },
      {
        header: "Total Price Paid",
        accessorFn: (row: OrderHistory) =>
          Number(row.total_price_paid).toFixed(2),
      },
      {
        header: "Created On",
        accessorFn: (row: OrderHistory) =>
          new Date(row.created_on).toLocaleString(),
        enableSorting: true,
      },
    ],
    [integratedSystemList.data],
  );

  const initialSorting = useMemo(() => {
    const sorting: { id: string; desc: boolean }[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith("sort_")) {
        sorting.push({
          id: key.replace("sort_", ""),
          desc: value === "desc",
        });
      }
    });
    return sorting;
  }, [searchParams]);

  const initialFilters = useMemo(() => {
    const filters: { id: string; value: string }[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith("filter_")) {
        filters.push({
          id: key.replace("filter_", ""),
          value: String(value),
        });
      }
    });
    return filters;
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: initialSorting,
      columnFilters: initialFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableSorting = table.getState().sorting;
  const tableFiltering = table.getState().columnFilters;

  useEffect(() => {
    const params = new URLSearchParams();

    tableSorting.forEach((sort) => {
      params.append(`sort_${sort.id}`, sort.desc ? "desc" : "asc");
    });

    tableFiltering.forEach((filter) => {
      params.append(`filter_${filter.id}`, String(filter.value));
    });

    const queryString = params.toString();
    router.push(`${pathName}?${queryString}`);
  }, [pathName, router, table, tableSorting, tableFiltering]);

  return (
    <OrderHistoryContainer>
      <Typography variant="h4">Order History</Typography>
      <TableContainer>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTh
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : null}
                  </StyledTh>
                ))}
              </tr>
            ))}
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <FilterTd key={header.id}>
                  {header.column.getCanFilter() ? (
                    <Filter column={header.column} />
                  ) : null}
                </FilterTd>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <StyledTd key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </StyledTd>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </OrderHistoryContainer>
  );
};

export default OrderHistory;
