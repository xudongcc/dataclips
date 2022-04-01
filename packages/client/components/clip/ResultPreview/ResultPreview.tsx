import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useUrlSearchParams } from "use-url-search-params";
import { TableOptions } from "react-table";

import { ResultFragment } from "../../../generated/graphql";
import { useDatabaseQuery } from "../../../hooks/useDatabaseQuery";
import { Table } from "../../common/Table";
import { DownloadButtonGroup } from "./components/DownloadButtonGroup";
import { ResultError } from "./components/ResultError";
import { StatResult } from "./components/StatResult";
import { Card } from "../../common/Card/Card";

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

  if (result?.error) {
    return (
      <Card>
        <ResultError error={result.error} />;
      </Card>
    );
  }

  return (
    <Card overflow="hidden">
      <Flex mb={4} justify="space-between">
        <StatResult result={result} />

        {token ? <DownloadButtonGroup token={token} /> : null}
      </Flex>

      <InputGroup mb={4}>
        <InputLeftAddon>过滤</InputLeftAddon>
        <Input
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

      <Table
        mx={{ base: -4, md: -6 }}
        mb={{ base: -4, md: -6 }}
        {...tableProps}
      />
    </Card>
  );
};
