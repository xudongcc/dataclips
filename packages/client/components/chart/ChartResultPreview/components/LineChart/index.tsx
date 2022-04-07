import { Axis, Chart, LineAdvance } from "bizcharts";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../../generated/graphql";
import { getFormatValue } from "../../../ChartEditTab/components/FormatFieldForm";
import { DoubleLineChart } from "./DoubleLineChart";
export interface LineChartConfig {
  xCol: string;
  yCol: { label: string; value: string }[];
  format: string;
  reverseOrder: boolean;
  doubleAxes: boolean;
}

interface LineChartPreviewProps {
  result: ResultFragment;
  config: LineChartConfig;
}

export const LineChartPreview: FC<LineChartPreviewProps> = ({
  result,
  config,
}) => {
  const data = useMemo(() => {
    if (!result?.error) {
      if (config.xCol && config.yCol.length) {
        const keyIndex = result.fields.findIndex((key) => key === config.xCol);

        const valuesIndex = config.yCol.map((y) => {
          const valueIndex = result.fields.findIndex((key) => key === y.value);

          if (valueIndex !== -1) {
            return valueIndex;
          }
        });

        // x 轴和 y 轴都存在
        if (keyIndex !== -1 && valuesIndex.length) {
          let res: Record<string, any>[] = [];

          // 双 y 轴
          if (config.doubleAxes) {
            res = result.values.map((value) => {
              const obj: Record<string, any> = {};

              valuesIndex.forEach((yIndex, i) => {
                obj.x = value[keyIndex];
                obj[`y${i + 1}`] = getFormatValue(value[yIndex]);
                obj[`y${i + 1}-name`] = result.fields[yIndex];
              });

              return obj;
            });
          } else {
            res = valuesIndex.map((yIndex, i) => {
              return result.values.map((value) => {
                return {
                  x: value[keyIndex],
                  y: getFormatValue(value[yIndex]),
                  diff: result.fields[yIndex],
                };
              });
            });
          }

          return config.reverseOrder ? res.flat(1).reverse() : res.flat(1);
        }
      }
    }

    return [];
  }, [config, result]);

  if (!data.length) {
    return null;
  }

  if (config.doubleAxes) {
    return <DoubleLineChart data={data} />;
  }

  return (
    <Chart
      scale={{
        y: {
          nice: true,
          range: [0, 1],
        },
      }}
      padding={[20, 20, 80, 50]}
      autoFit
      data={data}
    >
      <Axis
        name="y"
        label={{
          formatter: (val) => getFormatValue(val, config.format),
        }}
      />

      <LineAdvance
        tooltip={[
          "diff*y",
          (diff, y) => ({
            name: diff,
            value: getFormatValue(y, config.format),
          }),
        ]}
        shape="line"
        point
        area
        position="x*y"
        color="diff"
      />
    </Chart>
  );
};
