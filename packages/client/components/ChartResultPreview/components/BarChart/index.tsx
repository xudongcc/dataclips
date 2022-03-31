import { Axis, ColumnChart, Coordinate } from "bizcharts";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { FC, useMemo, useState } from "react";
import { ResultFragment } from "../../../../generated/graphql";
import { getFormatValue } from "../../../ChartEditTab/components/FormatFieldForm";

export interface BarChartConfig {
  variant: string;
  xCol: string;
  yCol: { label: string; value: string }[];
  isStack: boolean;
  format: string;
}

interface BarChartPreviewProps {
  result: ResultFragment;
  config: BarChartConfig;
}

export const BarChartPreview: FC<BarChartPreviewProps> = ({
  result,
  config,
}) => {
  const [oldData, setOldData] = useState<
    {
      x: string;
      y: string | number;
      diff: string;
    }[]
  >([]);
  const [oldConfig, setOldConfig] = useState<BarChartConfig>();

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
                y: getFormatValue(value[yIndex]),
                diff: result.fields[yIndex],
                format: config.format,
              };
            });
          });

          return res.flat(1);
        }
      }
    }

    return [];
  }, [config, result]);

  const BarChart = useMemo(() => {
    return (
      // @ts-ignore
      <ColumnChart
        xField="x"
        yField="y"
        data={oldData}
        legend={{ position: "bottom" }}
        autoFit
        tooltip={{
          fields: ["x", "y", "format"],
          formatter: ({ x, y, format }) => ({
            name: x,
            value: getFormatValue(y, format),
          }),
        }}
        colorField="diff"
        isGroup={!oldConfig?.isStack}
        isStack={oldConfig?.isStack}
      >
        <Axis
          name="y"
          label={{
            formatter: (val) => getFormatValue(val, config.format),
          }}
        />
        {/* 说是不支持 children 其实是支持的。。 */}
        <Coordinate transpose={oldConfig?.variant === "horizontal"} />
      </ColumnChart>
    );
  }, [config.format, oldConfig?.isStack, oldConfig?.variant, oldData]);

  useEffect(() => {
    if (!isEqual(data, oldData)) {
      setOldData(data);
    }
  }, [data, oldData]);

  useEffect(() => {
    if (!isEqual(config, oldConfig)) {
      setOldConfig(config);
    }
  }, [oldConfig, config]);

  if (!data.length) {
    return null;
  }

  return BarChart;
};
