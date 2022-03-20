import { Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../../../generated/graphql";
import { Stat } from "../../../Stat";

export interface MetricChartConfig {
  type: string;
  valueCol: string;
  compareCol: string;
}

interface MetricChartPreviewProps {
  result: ResultFragment;
  config: MetricChartConfig;
}

export const MetricChartPreview: FC<MetricChartPreviewProps> = ({
  result,
  config = { type: "", valueCol: "", compareCol: "" },
}) => {
  const component = useMemo(() => {
    const stat = {
      label: "",
      value: "",
      delta: { value: "", isUpwardsTrend: undefined },
    };

    const valueColIndex = result.fields.findIndex(
      (value) => value === config.valueCol
    );

    const compareColIndex = result.fields.findIndex(
      (c) => c === config.compareCol
    );

    if (valueColIndex !== -1) {
      stat.value = result.values[0]?.[valueColIndex];
    }

    if (valueColIndex !== -1 && compareColIndex !== -1) {
      stat.delta = {
        value: result.values[1]?.[compareColIndex],
        isUpwardsTrend:
          Number(result.values[0]?.[valueColIndex]) >
          Number(result.values[1]?.[compareColIndex]),
      };
    }

    return <Stat {...stat} />;
  }, [result, config]);

  return (
    <Flex h="100%" justify="center" align="center">
      {component}
    </Flex>
  );
};
