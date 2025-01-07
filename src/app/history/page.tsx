"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { styled } from "@mitodl/smoot-design";
import { Typography } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getCurrentSystem, getCurrentStatus } from "@/utils/system";
import type { PaginatedOrderHistoryList, OrderHistory } from "@/services/ecommerce/generated/v0";
import { usePaymentsOrderHistory } from "@/services/ecommerce/payments/hooks";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";

const OrderHistoryContainer = styled.div(() => ({
  width: "100%",
  padding: "32px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTh = styled.th`
  padding: 12px 16px;
  background-color: #f1f1f1;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;

const StyledTd = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
`;

const FilterContainer = styled.tr`
  background-color: #f1f1f1;
`;

const FilterTd = styled.td`
  padding: 8px 16px;
`;

const OrderHistory: React.FC = () => {
  const history =
    usePaymentsOrderHistory() as UseQueryResult<PaginatedOrderHistoryList>;
  const integratedSystemList = useMetaIntegratedSystemsList();
  const searchParams = useSearchParams();
  const specifiedSystem = getCurrentSystem(searchParams);
  const specifiedStatus = getCurrentStatus(searchParams);
  const router = useRouter();
  const pathName = usePathname();

  const [selectedSystem, setSelectedSystem] = useState<string>(specifiedSystem);
  const [selectedStatus, setSelectedStatus] = useState<string>(specifiedStatus);

  const data = useMemo(() => {
    if (!history.data) return [];
    const filteredData = history.data.results.filter((row) => {
      const system = String(row.lines[0]?.product.system);
      const status = row.state;
      return (
        (selectedSystem ? system === selectedSystem : true) &&
        (selectedStatus ? status === selectedStatus : true)
      );
    });
    return filteredData;
  }, [history.data, selectedSystem, selectedStatus]);

  // Define columns before using them in useTable
  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "state",
      },
      {
        Header: "Reference Number",
        accessor: "reference_number",
      },
      {
        Header: "Number of Products",
        accessor: (row: OrderHistory) => row.lines.length,
      },
      {
        Header: "System",
        accessor: (row: OrderHistory) => {
          const systemId = row.lines[0]?.product.system;
          const system = integratedSystemList.data?.results.find(
            (sys) => sys.id === systemId,
          );
          return system ? system.name : "N/A";
        },
      },
      {
        Header: "Total Price Paid",
        accessor: (row: OrderHistory) => Number(row.total_price_paid).toFixed(2),
      },
      {
        Header: "Created On",
        accessor: (row: OrderHistory) => new Date(row.created_on).toLocaleString(),
      },
    ],
    [integratedSystemList.data],
  );

  // Initialize sorting from URL query parameters after data is loaded
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
    setSortBy,
  } = useTable({ columns, data }, useSortBy);

  // On component mount, check if sorting params exist in the URL
  useEffect(() => {
    if (history.data) {
      const sort = searchParams.get("sort");
      const direction = searchParams.get("direction");
      if (sort && direction) {
        // Set the initial sorting parameters from the URL
        setSortBy([{ id: sort, desc: direction === "desc" }]);
      }
    }
  }, [history.data, searchParams, setSortBy]);

  // Sync sorting state with URL after data is loaded
  useEffect(() => {
    if (sortBy.length > 0) {
      const { id, desc } = sortBy[0];
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("sort", id);
      newParams.set("direction", desc ? "desc" : "asc");
      router.push(`${pathName}?${newParams.toString()}`);
    }
  }, [sortBy, searchParams, router, pathName]);

  const handleSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSystem = event.target.value.toString();
    const newParams = new URLSearchParams(searchParams.toString());
    setSelectedSystem(newSystem);
    newParams.set("system", newSystem);
    router.push(`${pathName}?${newParams.toString()}`);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value.toString();
    const newParams = new URLSearchParams(searchParams.toString());
    setSelectedStatus(newStatus);
    newParams.set("status", newStatus);
    router.push(`${pathName}?${newParams.toString()}`);
  };

  const uniqueSystems = useMemo(() => {
    const systems = history.data?.results
      .map((row) => row.lines[0]?.product.system)
      .filter(Boolean);
    return Array.from(new Set(systems));
  }, [history.data]);

  const uniqueStatuses = useMemo(() => {
    const statuses = history.data?.results
      .map((row) => row.state)
      .filter(Boolean);
    return Array.from(new Set(statuses));
  }, [history.data]);

  return (
    history.data && (
      <OrderHistoryContainer>
        <Typography variant="h4">Order History</Typography>
        <TableContainer>
          <StyledTable {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <StyledTh
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </StyledTh>
                  ))}
                </tr>
              ))}
              <FilterContainer>
                <FilterTd>
                  <label htmlFor="status-filter">Status:</label>
                  <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </FilterTd>
                <FilterTd
                  colSpan={2}
                  aria-label="Empty Filter Column"
                ></FilterTd>
                <FilterTd>
                  <label htmlFor="system-filter">System:</label>
                  <select
                    id="system-filter"
                    value={selectedSystem}
                    onChange={handleSystemChange}
                  >
                    <option value="">All Systems</option>
                    {uniqueSystems.map((system) => (
                      <option key={system} value={String(system)}>
                        {
                          integratedSystemList.data?.results.find(
                            (sys) => sys.id === system,
                          )?.name
                        }
                      </option>
                    ))}
                  </select>
                </FilterTd>
                <FilterTd
                  colSpan={2}
                  aria-label="Empty Filter Column"
                ></FilterTd>
              </FilterContainer>
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <StyledTd {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </StyledTd>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </StyledTable>
        </TableContainer>
      </OrderHistoryContainer>
    )
  );
};

export default OrderHistory;
