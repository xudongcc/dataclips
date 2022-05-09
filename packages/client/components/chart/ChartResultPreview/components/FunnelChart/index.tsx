import {
  Annotation,
  Axis,
  Chart,
  Coordinate,
  Interval,
  Legend,
  Tooltip,
} from "bizcharts";
import { readableColor } from "polished";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../../../../generated/graphql";
import { formatPercent } from "../../../../../utils/formatPercent";
import { getFormatValue } from "../../../ChartEditTab";
import { getGradientColors } from "./utils/getGradientColors";

export interface FunnelChartConfig {
  groupCol?: string;
  valueCol?: string;
  format?: string;
}

interface FunnelChartPreviesProps {
  result: ResultFragment;
  config: FunnelChartConfig;
}

export const FunnelChartPreview: FC<FunnelChartPreviesProps> = ({
  result,
  config,
}) => {
  const funnelData = useMemo(() => {
    if (!result?.error) {
      if (config?.groupCol && config?.valueCol) {
        const keyIndex = result.fields.findIndex(
          (key) => key === config.groupCol
        );
        const valueIndex = result.fields.findIndex(
          (key) => key === config.valueCol
        );

        if (keyIndex !== -1 && valueIndex !== -1) {
          return result.values.map((value, index) => {
            return {
              [config.groupCol]: value[keyIndex],
              [config.valueCol]: getFormatValue(value[valueIndex]),
              percent:
                index === 0
                  ? formatPercent(1)
                  : formatPercent(
                      getFormatValue(value[valueIndex]) /
                        getFormatValue(result.values[0][valueIndex])
                    ),
              // 上一级的占比
              previousPercent:
                index === 0
                  ? formatPercent(1)
                  : formatPercent(
                      getFormatValue(value[valueIndex]) /
                        getFormatValue(result.values[index - 1][valueIndex])
                    ),
            };
          });
        }
        return [];
      }
    }

    return [];
  }, [config, result]);

  if (result?.error) {
    return <>{result.error}</>;
  }

  const funnelGradientColors = getGradientColors(
    "#2c5282",
    "#63b3ed",
    funnelData.length
  );

  return (
    <div style={{ overflow: "hidden", height: "inherit" }}>
      <Chart data={funnelData} padding={[20, 150, 50]} autoFit>
        <Tooltip showTitle={false}>
          {(title, items) => {
            return (
              <div style={{ paddingTop: 12, paddingBottom: 12 }}>
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    gridTemplateColumns: "10px 1fr",
                  }}
                >
                  <div
                    style={{
                      background: items?.[0].color,
                      borderRadius: "50%",
                      height: 10,
                      width: 10,
                    }}
                  />
                  <div>
                    <div>{title}</div>

                    <div key={items?.[0]?.data?.key} style={{ marginTop: 4 }}>
                      <div>
                        {config?.valueCol}:{" "}
                        {getFormatValue(
                          items?.[0]?.data?.value,
                          config?.format
                        )}
                      </div>

                      <div style={{ marginTop: 4, marginBottom: 4 }}>
                        总占比: {items?.[0]?.data?.percent}
                      </div>
                      <div>上一级占比: {items?.[0]?.data?.previousPercent}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </Tooltip>

        <Axis name={config?.valueCol} grid={null} label={null} />

        <Axis
          name={config?.groupCol}
          label={null}
          line={null}
          grid={null}
          tickLine={null}
        />

        <Coordinate scale={[1, -1]} transpose type="rect" />

        <Legend />

        {funnelData.map((item, index) => {
          return (
            <Annotation.Text
              key={index}
              top={true}
              position={[item[config?.groupCol], "center"]}
              content={item.percent}
              style={{
                fill: readableColor(funnelGradientColors[index]),
                fontSize: 12,
                textAlign: "center",
                shadowBlur: 2,
                shadowColor: "rgba(0, 0, 0, .45)",
              }}
            />
          );
        })}

        <Interval
          position={`${config?.groupCol}*${config?.valueCol}`}
          adjust="symmetric"
          shape="funnel"
          color={[config?.groupCol, funnelGradientColors]}
          label={[
            `${config?.groupCol}`,
            (key) => ({ content: key }),
            {
              offset: 35,
              labelLine: {
                style: {
                  lineWidth: 1,
                  stroke: "rgba(0, 0, 0, 0.15)",
                },
              },
            },
          ]}
        />
      </Chart>
    </div>
  );
};
