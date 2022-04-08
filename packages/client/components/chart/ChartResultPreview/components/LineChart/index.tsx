import { Axis, Chart, LineAdvance } from "bizcharts";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../../generated/graphql";
import { getFormatValue } from "../../../ChartEditTab/components/FormatFieldForm";

export interface LineChartConfig {
  xCol: string;
  // 后面统一优化传入的值
  yCol: { label: string; value: string }[];
  format: string;
  reverseOrder: boolean;
  doubleAxes: boolean;
  doubleAxesCol: string[];
}

interface LineChartPreviewProps {
  result: ResultFragment;
  config: LineChartConfig;
}

export const LineChartPreview: FC<LineChartPreviewProps> = ({
  result,
  config,
}) => {
  // 有没有开启双 y 轴
  const hasDoubleAxes = useMemo(() => {
    return !!(config.doubleAxes && config.doubleAxesCol.length);
  }, [config.doubleAxes, config.doubleAxesCol.length]);

  const data = useMemo(() => {
    if (!result?.error) {
      let res: Record<string, any>[] = [];

      if (config.xCol) {
        const keyIndex = result.fields.findIndex((key) => key === config.xCol);

        // 存在多条 y（单轴数据）
        if (config.yCol.length) {
          const valuesIndex = config.yCol.map((y) => {
            const valueIndex = result.fields.findIndex(
              (key) => key === y.value
            );

            if (valueIndex !== -1) {
              return valueIndex;
            }
          });

          // x 轴和 y 轴都存在
          if (keyIndex !== -1 && valuesIndex.length) {
            res = [
              ...res,
              ...valuesIndex.map((yIndex) => {
                return result.values.map((value) => {
                  const obj: Record<string, any> = {
                    x: value[keyIndex],
                    y: getFormatValue(value[yIndex]),
                    diff: result.fields[yIndex],
                  };

                  // 如果双 y 轴开启的话，用于双轴区分所有颜色
                  if (hasDoubleAxes) {
                    obj.doubleAxesColor = result.fields[yIndex];
                  }

                  return obj;
                });
              }),
            ];
          }
        }

        // 双 y 轴数据
        if (hasDoubleAxes) {
          const doubleAxesColIndex = config.doubleAxesCol.map((y) => {
            const valueIndex = result.fields.findIndex((key) => key === y);

            if (valueIndex !== -1) {
              return valueIndex;
            }
          });

          res = [
            ...res,
            ...doubleAxesColIndex.map((yIndex) => {
              return result.values.map((value) => {
                return {
                  x: value[keyIndex],
                  y1: getFormatValue(value[yIndex]),
                  diff2: result.fields[yIndex],
                  doubleAxesColor: result.fields[yIndex],
                };
              });
            }),
          ];
        }
      }

      return config.reverseOrder ? res.flat(1).reverse() : res.flat(1);
    }

    return [];
  }, [config, hasDoubleAxes, result]);

  if (!data.length) {
    return null;
  }

  return (
    <Chart
      scale={{
        y: {
          nice: true,
          tickCount: 5,
          range: [0, 1],
        },
        y1: {
          nice: true,
          tickCount: 5,
          range: [0, 1],
        },
      }}
      padding={[20, 80, 80, 80]}
      autoFit
      data={data}
    >
      <LineAdvance
        tooltip={[
          "diff*diff2*y*y1",
          (diff, diff2, y, y1) => {
            if (
              diff !== undefined &&
              y !== undefined &&
              diff2 === undefined &&
              y1 === undefined
            ) {
              return {
                name: diff,
                value: getFormatValue(y, config.format),
              };
            }

            // 证明是双 y 轴
            if (
              diff2 !== undefined &&
              y1 !== undefined &&
              diff === undefined &&
              y === undefined
            ) {
              return {
                name: diff2,
                value: getFormatValue(y1, config.format),
              };
            }
          },
        ]}
        shape="line"
        point
        area
        position="x*y"
        color={hasDoubleAxes ? "doubleAxesColor" : "diff"}
      />
      <Axis
        name="y"
        label={{
          formatter: (val) => getFormatValue(val, config.format),
        }}
      />

      {/* 双 y 轴 */}
      <LineAdvance
        shape="line"
        point
        area
        tooltip={false}
        position="x*y1"
        color="doubleAxesColor"
        visible={hasDoubleAxes}
      />
      <Axis
        visible={hasDoubleAxes}
        name="y1"
        label={{
          formatter: (val) => getFormatValue(val, config.format),
        }}
      />
    </Chart>
  );
};
