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
        fields: [config?.key, config?.value, "format"],
        formatter: (item) => ({
          name: item[config?.key],
          value: getFormatValue(item[config?.value], item?.format),
        }),
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
      <Tooltip showTitle={false} />
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
