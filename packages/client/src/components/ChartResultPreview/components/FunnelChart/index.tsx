import { Box, Grid, Text } from "@chakra-ui/react";
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

import { ResultFragment } from "../../../../generated/graphql";
import { formatPercent } from "../../../../utils/formatPercent";
import { getGradientColors } from "./utils/getGradientColors";

export interface FunnelChartConfig {
  keyField: string;
  valueField: string;
}

interface FunnelChartPreviesProps {
  result: ResultFragment;
  config: FunnelChartConfig;
}

export const FunnelChartPreview: FC<FunnelChartPreviesProps> = ({
  result,
  config,
}) => {
  if (result?.error) {
    return <>{result.error}</>;
  }

  const funnelData = useMemo(() => {
    if (config.keyField && config.valueField) {
      const keyIndex = result.fields.findIndex(
        (key) => key === config.keyField
      );
      const valueIndex = result.fields.findIndex(
        (key) => key === config.valueField
      );

      if (keyIndex !== -1 && valueIndex !== -1) {
        return result.values.map((value, index) => {
          return {
            [config.keyField]: value[keyIndex],
            [config.valueField]: +value[valueIndex],
            percent:
              index === 0
                ? formatPercent(1)
                : formatPercent(
                    +value[valueIndex] / +result.values[0][valueIndex]
                  ),
            // 上一级的占比
            previousPercent:
              index === 0
                ? formatPercent(1)
                : formatPercent(
                    +value[valueIndex] / +result.values[index - 1][valueIndex]
                  ),
          };
        });
      }
      return [];
    }
    return [];
  }, [config, result]);

  const funnelGradientColors = getGradientColors(
    "#2c5282",
    "#63b3ed",
    funnelData.length
  );

  return (
    <Box overflow="hidden" height="inherit">
      <Chart data={funnelData} padding={[20, 150, 50]} autoFit>
        <Tooltip showTitle={false}>
          {(title, items) => {
            return (
              <Box py={12}>
                <Grid gap={8} templateColumns="10px 1fr">
                  <Box bg={items?.[0].color} borderRadius="50%" h={10} w={10} />
                  <Box>
                    <Text>{title}</Text>

                    <Box key={items?.[0]?.data?.key} mt={4}>
                      <Text>
                        {config.valueField}: {items?.[0]?.data?.value}
                      </Text>

                      <Text my={4}>总占比: {items?.[0]?.data?.percent}</Text>
                      <Text>
                        上一级占比: {items?.[0]?.data?.previousPercent}
                      </Text>
                    </Box>
                  </Box>
                </Grid>
              </Box>
            );
          }}
        </Tooltip>

        <Axis name={config.valueField} grid={null} label={null} />
        <Axis
          name={config.keyField}
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
              position={[item[config.keyField], 300]}
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
          position={`${config.keyField}*${config.valueField}`}
          adjust="symmetric"
          shape="funnel"
          color={[config.keyField, funnelGradientColors]}
          label={[
            `${config.keyField}`,
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
    </Box>
  );
};
