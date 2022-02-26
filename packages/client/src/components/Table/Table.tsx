import {
  Box,
  Flex,
  Table as BaseTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import { ResultFragment } from "../../generated/graphql";
import { useTable, useSortBy, TableOptions } from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

export interface ResultPreviewProps {
  token?: string;
  result: ResultFragment;
}

export interface TableProps<T extends object = {}> extends TableOptions<T> {}

export function Table<T extends object = {}>(props: TableProps<T>) {
  const borderColorColor = useColorModeValue("gray.100", "gray.700");
  const headerBackgroundColor = useColorModeValue("gray.50", "gray.800");

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(props, useSortBy);

  return (
    <Box
      borderRadius="md"
      borderColor={borderColorColor}
      borderWidth={1}
      overflowY="scroll"
    >
      <BaseTable
        sx={{ borderCollapse: "separate", borderSpacing: 0 }}
        {...getTableProps()}
      >
        <Thead position="sticky" top={0}>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  whiteSpace="nowrap"
                  backgroundColor={headerBackgroundColor}
                  userSelect="none"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Flex alignItems="center">
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon ml={1} w={4} h={4} />
                      ) : (
                        <ChevronUpIcon ml={1} w={4} h={4} />
                      )
                    ) : (
                      ""
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td whiteSpace="nowrap" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </BaseTable>
    </Box>
  );
}
