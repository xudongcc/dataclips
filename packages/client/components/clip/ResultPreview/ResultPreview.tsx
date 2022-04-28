import { useToast } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useUrlSearchParams } from "use-url-search-params";

import { ResultFragment } from "../../../generated/graphql";
import { useDatabaseQuery } from "../../../hooks/useDatabaseQuery";
import { DownloadButtonGroup } from "./components/DownloadButtonGroup";
import { ResultError } from "./components/ResultError";
import { StatResult } from "./components/StatResult";
import { Card } from "../../common/Card";
import { Table, Input, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getFormatValue } from "../../chart/ChartEditTab";
import { formatPercent } from "../../../utils/formatPercent";

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

  const columns = useMemo<ColumnsType<any>>(() => {
    if (result?.fields?.length) {
      return result?.fields?.map((field) => ({
        title: (
          <div style={{ whiteSpace: "nowrap", userSelect: "none" }}>
            {field}
          </div>
        ),
        dataIndex: field,
        sorter: (a, b) => {
          return getFormatValue(a?.[field]) - getFormatValue(b?.[field]);
        },
        showSorterTooltip: false,
        width: formatPercent(1 / result?.fields?.length),
        render: (value) => {
          return <div style={{ whiteSpace: "nowrap" }}>{value}</div>;
        },
      }));
    }

    return [];
  }, [result]);

  const tableData = useMemo(() => {
    if (result?.fields?.length && result?.values?.length) {
      return result.values.map((value) => {
        const item: Record<string, any> = {};

        result?.fields.forEach((field, index) => {
          item[field] = value[index];
        });

        return item;
      });
    }

    return [];
  }, [result?.fields, result?.values]);

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
    <Card
      title={<StatResult result={result} />}
      extra={
        token ? <DownloadButtonGroup result={result} token={token} /> : null
      }
    >
      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <Input
          addonBefore="过滤"
          value={where}
          onChange={(event) => setWhere(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setSearchParams({ where });
              handleQuery();
            }
          }}
        />

        <Table
          bordered
          dataSource={tableData}
          columns={columns}
          scroll={{ x: "auto" }}
          pagination={false}
        />
      </Space>
    </Card>
  );
};
