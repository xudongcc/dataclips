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
import { ResultFragment } from "../../../../generated/graphql";
import { formatPercent } from "../../../../utils/formatPercent";
import { getFormatValue } from "../../../ChartEditTab/components/FormatFieldForm";

export interface PieChartConfig {
  variant: string;
  key: string;
  value: string;
  format: string;
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
      if (config.key && config.value) {
        const keyIndex = result.fields.findIndex((key) => key === config.key);
        const valueIndex = result.fields.findIndex(
          (key) => key === config.value
        );

        if (keyIndex !== -1 && valueIndex !== -1) {
          let total = 0;

          result.values.forEach((arr) => {
            total = total + getFormatValue(arr[valueIndex]);
          });

          return result.values.map((value) => {
            return {
              [config.key]: value[keyIndex],
              [config.value]: getFormatValue(value[valueIndex]),
              percent: getFormatValue(value[valueIndex]) / total,
              format: config.format,
            };
          });
        }
        return [];
      }
    }

    return [];
  }, [config, result]);

  if (!data.length) {
    return null;
  }

  return config.variant === "range" ? (
    <DonutChart
      tooltip={{
        fields: [config.key, config.value, "format"],
        formatter: (item) => {
          return {
            name: item[config.key],
            value: getFormatValue(item[config.value], item.format),
          };
        },
      }}
      label={{
        formatter: (_, value) => {
          return getFormatValue(value._origin?.value, value._origin?.format);
        },
      }}
      statistic={{
        content: {
          formatter: (_, values) => {
            const format = values[0]?.format;

            return getFormatValue(
              sumBy(values, (o) => o.value),
              format
            );
          },
        },
      }}
      data={data}
      autoFit
      radius={0.8}
      padding="auto"
      angleField="value"
      colorField="key"
      legend={{ position: "bottom" }}
      pieStyle={{ stroke: "white", lineWidth: 5 }}
    />
  ) : (
    <Chart
      padding={[20, 20, 80, 50]}
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
        position="percent"
        adjust="stack"
        color="key"
        style={{
          lineWidth: 1,
          stroke: "#fff",
        }}
        label={[
          "percent",
          {
            content: ({ percent }) => {
              return formatPercent(percent);
            },
          },
        ]}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
};
