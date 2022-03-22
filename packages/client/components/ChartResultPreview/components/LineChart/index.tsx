import { Chart, LineAdvance } from "bizcharts";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../generated/graphql";

export interface LineChartConfig {
  xCol: string;
  yCol: { label: string; value: string }[];
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
          const res = valuesIndex.map((yIndex) => {
            return result.values.map((value) => {
              return {
                x: value[keyIndex],
                y:
                  typeof Number(value[yIndex]) === "number" &&
                  !isNaN(Number(value[yIndex]))
                    ? Number(value[yIndex])
                    : value[yIndex],
                diff: result.fields[yIndex],
              };
            });
          });

          return res.flat(1);
        }
      }
    }

    return [];
  }, [config, result]);

  if (!data.length) {
    return null;
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
      <LineAdvance shape="line" point area position="x*y" color="diff" />
    </Chart>
  );
};
