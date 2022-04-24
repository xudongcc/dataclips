import {
  Chart,
  Coordinate,
  DonutChart,
  Interaction,
  Interval,
  Tooltip,
} from "bizcharts";
import { sumBy } from "lodash";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../../generated/graphql";
import { formatPercent } from "../../../../../utils/formatPercent";
import { getFormatValue } from "../../../ChartEditTab";
import sortBy from "lodash/sortBy";
import { Space } from "antd";
import styled from "styled-components";

const ColorCircle = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  background-color: ${(props) => props.color};
`;

export interface PieChartConfig {
  variant?: string;
  key?: string;
  value?: string;
  format?: string;
}

interface PieChartPreviewProps {
  result: ResultFragment;
  config: PieChartConfig;
}

export const PieChartPreview: FC<PieChartPreviewProps> = ({
  result,
  config,
}) => {
  const data = useMemo(() => {
    if (!result?.error) {
      if (config?.key && config?.value) {
        const keyIndex = result.fields.findIndex((key) => key === config.key);
        const valueIndex = result.fields.findIndex(
          (key) => key === config.value
        );

        if (keyIndex !== -1 && valueIndex !== -1) {
          const total = sumBy(result.values, (arr) =>
            getFormatValue(arr[valueIndex])
          );

          return sortBy(
            result.values.map((value) => {
              return {
                [config.key]: value[keyIndex],
                [config.value]: getFormatValue(value[valueIndex]),
                percent: getFormatValue(value[valueIndex]) / total,
                format: config.format,
              };
            }),
            ["percent"]
          );
        }
        return [];
      }
    }

    return [];
  }, [config, result]);

  if (!data.length) {
    return null;
  }

  return config?.variant === "range" ? (
    <DonutChart
      tooltip={{
        fields: [config?.key, config?.value, "format", "percent"],
        formatter: (item) => ({
          name: item[config?.key],
          value: getFormatValue(item[config?.value], item?.format),
          percent: formatPercent(item?.percent),
        }),
        containerTpl: `
        <div class="g2-tooltip">
          <div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>
          <ul class="g2-tooltip-list"></ul>
        </div>
        `,
        itemTpl: `
        <li data-index={index}>
          <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
          <span style="display: inline-grid;grid-gap: 10px;grid-template-columns: repeat(3, 1fr);padding-bottom: 12px;">
            <span>{name}</span>
            <span>数值：{value}</span>
            <span>占比：{percent}</span>
          </span>
        </li>
        `,
      }}
      label={{
        formatter: (_, value) =>
          getFormatValue(value._origin?.[config?.value], value._origin?.format),
      }}
      statistic={{
        content: {
          formatter: (_, values) =>
            getFormatValue(
              sumBy(values, (o) => o?.[config?.value]),
              values[0]?.format
            ),
        },
        title: {
          customHtml: () => "统计",
        },
      }}
      data={data}
      autoFit
      radius={0.8}
      padding="auto"
      angleField={config?.value}
      colorField={config?.key}
      legend={{ position: "bottom" }}
      pieStyle={{ stroke: "white", lineWidth: 5 }}
    />
  ) : (
    <Chart
      padding="auto"
      scale={{
        percent: {
          formatter: (val) => formatPercent(val),
        },
      }}
      autoFit
      data={data}
    >
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false}>
        {(_, items) => {
          return (
            <Space style={{ padding: 12 }}>
              <ColorCircle color={items[0].mappingData.color} />
              <span style={{ marginRight: 8 }}>{items[0].name}</span>{" "}
              <span>
                数值：
                {items[0].value}
              </span>{" "}
              <span>占比：{formatPercent(items[0].data.percent)}</span>
            </Space>
          );
        }}
      </Tooltip>
      <Interval
        position={config?.value}
        adjust="stack"
        color={config?.key}
        style={{
          lineWidth: 1,
          stroke: "#fff",
        }}
        label={[
          "percent",
          {
            content: ({ percent }) => formatPercent(percent),
          },
        ]}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
};
