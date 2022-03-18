import { Flex, HStack, Box } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../../../generated/graphql";

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
  console.log("result", result);

  const component = useMemo(() => {
    const valueColIndex = result.fields.findIndex(
      (value) => value === config.valueCol
    );

    const compareColIndex = result.fields.findIndex(
      (c) => c === config.compareCol
    );

    if (valueColIndex !== -1 && compareColIndex !== -1) {
      return (
        <HStack>
          <Box>{result.values[valueColIndex]?.[0]}</Box>

          <Box>{result.values[compareColIndex]?.[0]}</Box>
        </HStack>
      );
    }

    return <></>;
  }, [result, config]);

  return (
    <Flex h="100%" justify="center" align="center">
      {component}
    </Flex>
  );
};
