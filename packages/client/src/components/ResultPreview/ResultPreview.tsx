import { FC, useCallback, useEffect, useRef } from 'react';
import {
  chakra,
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ButtonGroup,
  Button,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import moment from 'moment';
import ms from 'ms';
import { saveAs } from 'file-saver';
import { ResultFragment } from '@/generated/graphql';
import { useTable, useSortBy, Column } from 'react-table';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { InitialType, useUrlSearchParams } from 'use-url-search-params';
import { useLocalStorage } from 'react-use';

export interface ResultPreviewProps {
  slug?: string;
  result: ResultFragment & { columns: Column<object>[]; tableValues: object[] };
}

interface SortType {
  order?: string;
  orderDirection?: string;
}

interface TableSortState {
  id: string;
  desc: boolean;
}

export const ResultPreview: FC<ResultPreviewProps> = ({ slug, result }) => {
  const [urlSearchParams, setUrlSearchParams]: [
    SortType,
    (nextQuery: InitialType) => void,
  ] = useUrlSearchParams();

  const [localSortParams, setLocalSortParams, remove] =
    useLocalStorage<SortType>('sort');

  //  首次，url 没参数，本地有参数
  const paramsFromLocalRef = useRef(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setSortBy,
    state: { sortBy },
  } = useTable(
    {
      columns: result.columns,
      data: result.tableValues,
      // 默认排序状态
      initialState: urlSearchParams?.order
        ? {
            sortBy: [
              {
                id: urlSearchParams.order,
                desc: urlSearchParams?.orderDirection === 'desc' || false,
              },
            ],
          }
        : undefined,
    },
    useSortBy,
  );

  const handleDownload = useCallback(
    (extname: string) => {
      saveAs(
        `/clips/${slug}${extname}`,
        `${moment().format('YYYYMMDD-HHmmss')}${extname}`,
      );
    },
    [slug],
  );

  // 排序发生变化的时候会触发 sortBy 的变化
  useEffect(() => {
    const sortParams: SortType = {
      order: `${sortBy[0]?.id}`,
      orderDirection: `${sortBy[0]?.desc ? 'desc' : 'asc'}`,
    };

    if (sortBy.length) {
      setLocalSortParams(sortParams);
      setUrlSearchParams(sortParams as InitialType);
    } else {
      remove();
      setUrlSearchParams({ order: undefined, orderDirection: undefined });
    }
  }, [sortBy]);

  // 第一次检查同步
  useEffect(() => {
    if (!urlSearchParams?.order && !urlSearchParams?.orderDirection) {
      if (localSortParams) {
        paramsFromLocalRef.current = true;
        setUrlSearchParams(localSortParams as InitialType);
        setSortBy([
          {
            id: localSortParams.order as string,
            desc: localSortParams.orderDirection === 'desc',
          },
        ]);
      }
    }

    if (!localSortParams) {
      if (urlSearchParams?.order || urlSearchParams?.orderDirection) {
        const sortParams: SortType = {};

        if (urlSearchParams?.order) {
          sortParams.order = urlSearchParams?.order;
        }

        if (urlSearchParams?.orderDirection) {
          sortParams.orderDirection = urlSearchParams?.orderDirection;
        }

        setLocalSortParams(sortParams);
      }
    }
  }, []);

  // url 参数发生变化，重新设置排序
  useEffect(() => {
    // 没有判断首次的情况，会循环渲染
    if (!paramsFromLocalRef.current) {
      if (urlSearchParams?.orderDirection || urlSearchParams?.order) {
        const sortState: Required<TableSortState> = { id: '', desc: false };

        if (urlSearchParams?.order) {
          sortState.id = urlSearchParams?.order;
        }

        if (urlSearchParams?.orderDirection) {
          sortState.desc = urlSearchParams?.orderDirection === 'desc';
        }

        setSortBy?.([sortState]);
      } else {
        setSortBy?.([]);
      }
    } else {
      paramsFromLocalRef.current = false;
    }
  }, [urlSearchParams]);

  return (
    <Box p={4} minH="full">
      {result.error ? (
        <Box
          p={4}
          bgColor="red.50"
          borderWidth={1}
          borderColor="red.500"
          borderRadius="md"
          color="red.500"
        >
          <Text fontWeight="bold">查询错误</Text>
          <chakra.pre>{result.error}</chakra.pre>
        </Box>
      ) : (
        <>
          <Flex mb={4} justify="space-between">
            <HStack spacing={4}>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  计数
                </Box>
                <Box>{result.values.length} 行</Box>
              </Box>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  耗时
                </Box>
                <Box>{ms(result.duration)}</Box>
              </Box>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  更新时间
                </Box>
                <Box>
                  {moment(result.finishedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Box>
              </Box>
            </HStack>

            {slug ? (
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.csv')}
                >
                  CSV
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.xlsx')}
                >
                  XLSX
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.json')}
                >
                  JSON
                </Button>
              </ButtonGroup>
            ) : null}
          </Flex>

          <Box
            borderRadius="md"
            borderColor="var(--chakra-colors-gray-100)"
            borderWidth={1}
            overflowY="auto"
            maxHeight="calc(100vh - 80px)"
          >
            <Table
              {...getTableProps()}
              sx={{ borderCollapse: 'separate', borderSpacing: 0 }}
            >
              <Thead position="sticky" top={0}>
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        whiteSpace="nowrap"
                        bg="var(--chakra-colors-bg-canvas)"
                        userSelect="none"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                      >
                        <Flex alignItems="center">
                          {column.render('Header')}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronDownIcon ml={1} w={4} h={4} />
                            ) : (
                              <ChevronUpIcon ml={1} w={4} h={4} />
                            )
                          ) : (
                            ''
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
                          <Td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};
