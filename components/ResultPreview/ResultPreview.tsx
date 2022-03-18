import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useUrlSearchParams } from "use-url-search-params";
import { TableOptions } from "react-table";

import { ResultFragment } from "../../generated/graphql";
import { useDatabaseQuery } from "../../hooks/useDatabaseQuery";
import { Table } from "../Table";
import { DownloadButtonGroup } from "./components/DownloadButtonGroup";
import { ResultError } from "./components/ResultError";
import { StatResult } from "./components/StatResult";

export interface ResultPreviewProps {
  token?: string;
  result: ResultFragment;
}

export const ResultPreview: FC<ResultPreviewProps> = ({
  token,
  result: rawResult,
}) => {
  const toast = useToast();

  const databaseQuery = useDatabaseQuery();

  const [searchParams, setSearchParams] = useUrlSearchParams();

  console.log("searchParams", searchParams);

  const [where, setWhere] = useState<string>(
    (searchParams?.where as string) || ""
  );

  const [result, setResult] = useState<ResultFragment>(rawResult);

  const tableProps = useMemo<TableOptions<any>>(() => {
    const options: TableOptions<any> = {
      columns: [],
      data: [],
    };

    if (result?.values && result?.fields) {
      // table 的所需要的数据
      options.data = result.values.map((value) => {
        const item: Record<string, any> = {};

        result.fields.forEach((key: string, index: number) => {
          item[key] = value[index];
        });

        return item;
      });

      // 生成 columns
      options.columns = result.fields.map((value: string) => ({
        Header: value,
        accessor: value,
      }));
    }

    return options;
  }, [result]);

  const handleQuery = useCallback(async () => {
    try {
      if (rawResult) {
        const { fields, values } = await databaseQuery(
          rawResult.fields,
          rawResult.values,
          `SELECT * FROM preview ${
            searchParams?.where ? `WHERE ${searchParams?.where}` : ``
          };`
        );

        setResult({
          ...rawResult,
          fields,
          values: values as string[][],
        });
      }
    } catch (err: any) {
      console.error(err);

      toast({
        title: "查询错误",
        status: "error",
        description: err.message,
      });
    }
  }, [databaseQuery, rawResult, searchParams?.where, toast]);

  useEffect(() => {
    handleQuery();
  }, [handleQuery, rawResult]);

  return (
    <Box p={4} minH="full">
      {result?.error ? (
        <ResultError error={result.error} />
      ) : (
        <>
          <Flex mb={4} justify="space-between">
            <StatResult result={result} />

            {token ? <DownloadButtonGroup token={token} /> : null}
          </Flex>

          <Flex mb={4}>
            <InputGroup size="sm">
              {/* eslint-disable-next-line react/no-children-prop */}
              <InputLeftAddon borderRadius="md" children="过滤" />
              <Input
                borderRadius="md"
                fontFamily={'Menlo, Monaco, "Courier New", monospace'}
                fontSize="xs"
                value={where}
                onChange={(event) => setWhere(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSearchParams({ where });
                    handleQuery();
                  }
                }}
              />
            </InputGroup>
          </Flex>

          <Table {...tableProps} />
        </>
      )}
    </Box>
  );
};
