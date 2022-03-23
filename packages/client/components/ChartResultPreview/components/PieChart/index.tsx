import {
  Axis,
  Chart,
  Coordinate,
  DonutChart,
  getTheme,
  Interaction,
  Interval,
  Tooltip,
} from "bizcharts";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../generated/graphql";
import { formatPercent } from "../../../../utils/formatPercent";

export interface PieChartConfig {
  variant: string;
  key: string;
  value: string;
}

interface PieChartPreviewProps {
  result: ResultFragment;
  config: PieChartConfig;
}

export const PieChartPreview: FC<PieChartPreviewProps> = ({
  result,
  config,
}) => {
  console.log("config", config);

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
            total = total + (Number(arr[valueIndex]) || 0);
          });

          return result.values.map((value) => {
            return {
              [config.key]: value[keyIndex],
              [config.value]: +value[valueIndex],
              percent: +value[valueIndex] / total,
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
            content: ({ percent }) => formatPercent(percent),
          },
        ]}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
};
