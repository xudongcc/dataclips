import { Chart, Axis, Legend, Line, Tooltip, Point, Area } from "bizcharts";
import { FC, useRef } from "react";

interface DoubleLineChartProps {
  data: any;
}

const colors = ["#6394f9", "#62daaa"];

export const DoubleLineChart: FC<DoubleLineChartProps> = ({ data }) => {
  const doubleLineChartRef = useRef(null);

  const y1Name = data?.[0]?.["y1-name"];
  const y2Name = data?.[0]?.["y2-name"];

  return (
    <Chart
      animate
      scale={{
        y1: {
          alias: y1Name,
          tickCount: 5,
          min: 0,
          type: "linear-strict",
        },
        y2: {
          alias: y2Name,
          tickCount: 5,
          min: 0,
          type: "linear-strict",
        },
      }}
      padding={[20, 80, 80, 80]}
      autoFit
      data={data}
      onGetG2Instance={(chart) => {
        doubleLineChartRef.current = chart;
      }}
    >
      <Tooltip shared showCrosshairs />

      <Axis name="y1" title />
      <Axis name="y2" title />

      <Legend
        custom={true}
        allowAllCanceled={true}
        onChange={(ev) => {
          const item = ev.item;
          const value = item.value;
          const checked = !item.unchecked;
          const geoms = doubleLineChartRef.current?.geometries;

          for (let i = 0; i < geoms.length; i++) {
            const geom = geoms[i];

            if (geom.getYScale().field === value) {
              if (checked) {
                geom.show();
              } else {
                geom.hide();
              }
            }
          }
        }}
        items={[
          {
            value: "y1",
            name: y1Name,
            marker: {
              symbol: "hyphen",
              style: { stroke: colors[0], r: 5, lineWidth: 2 },
            },
          },
          {
            value: "y2",
            name: y2Name,
            marker: {
              symbol: "hyphen",
              style: { stroke: colors[1], r: 5, lineWidth: 2 },
            },
          },
        ]}
      />

      <Area color={colors[0]} position="x*y1" shape="dotLine" />
      <Area color={colors[1]} position="x*y2" shape="dotLine" />

      <Line position="x*y1" color={colors[0]} />
      <Point
        position="x*y1"
        color={colors[0]}
        size={3}
        shape="circle"
        tooltip={false}
      />

      <Line position="x*y2" color={colors[1]} />
      <Point
        position="x*y2"
        color={colors[1]}
        size={3}
        shape="circle"
        tooltip={false}
      />
    </Chart>
  );
};
