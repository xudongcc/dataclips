import { Axis, Chart, Line, LineAdvance, Point } from "bizcharts";
import { FC, useMemo } from "react";
import { ResultFragment } from "../../../../../generated/graphql";
import { getFormatValue } from "../../../ChartEditTab/components/FormatFieldForm";

export interface LineChartConfig {
  xCol: string;
  yCol: { label: string; value: string }[];
  format: string;
  reverseOrder: boolean;
  doubleAxes: boolean;
  doubleAxesCol: string;
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
                  return {
                    x: value[keyIndex],
                    y: getFormatValue(value[yIndex]),
                    diff: result.fields[yIndex],
                  };
                });
              }),
            ];
          }
        }

        // 双 y 轴数据
        if (config.doubleAxes && config.doubleAxesCol) {
          const valueIndex = result.fields.findIndex(
            (key) => key === config.doubleAxesCol
          );

          res = [
            ...res,
            result.values.map((value) => {
              return {
                x: value[keyIndex],
                y1: getFormatValue(value[valueIndex]),
              };
            }),
          ];
        }
      }

      return config.reverseOrder ? res.flat(1).reverse() : res.flat(1);
    }

    return [];
  }, [config, result]);

  // 双 y 轴显示的坐标轴名字
  const doubleAxesColName = useMemo(() => {
    if (!result?.error) {
      if (config.xCol && config.doubleAxes && config.doubleAxesCol) {
        const valueIndex = result.fields.findIndex(
          (key) => key === config.doubleAxesCol
        );

        return result.fields[valueIndex];
      }
    }
    return "";
  }, [config, result]);

  if (!data.length) {
    return null;
  }

  return (
    <>
      <Chart
        scale={{
          y: {
            nice: true,
            tickCount: 5,
            range: [0, 1],
          },
          y1: {
            alias: doubleAxesColName,
            tickCount: 5,
            min: 0,
            type: "linear-strict",
          },
        }}
        padding={[20, 80, 80, 80]}
        autoFit
        data={data}
      >
        <LineAdvance
          tooltip={[
            "diff*y*y1",
            (diff, y, y1) => {
              if (diff !== undefined && y !== undefined) {
                return {
                  name: diff,
                  value: getFormatValue(y, config.format),
                };
              }

              // 证明是双 y 轴
              if (y1 !== undefined) {
                return {
                  color: "#8D4EDA",
                  name: doubleAxesColName,
                  value: getFormatValue(y1, config.format),
                };
              }
            },
          ]}
          shape="line"
          point
          area
          position="x*y"
          color="diff"
        />
        <Axis
          name="y"
          label={{
            formatter: (val) => getFormatValue(val, config.format),
          }}
        />

        {/* 双 y 轴配置 */}
        <Axis
          name="y1"
          title
          label={{
            formatter: (val) => getFormatValue(val, config.format),
          }}
          visible={!!(config.doubleAxes && config.doubleAxesCol)}
        />
        <Line position="x*y1" color="#8D4EDA" />
        <Point
          position="x*y1"
          color="#8D4EDA"
          size={3}
          shape="circle"
          tooltip={false}
        />
      </Chart>
    </>
  );
};
