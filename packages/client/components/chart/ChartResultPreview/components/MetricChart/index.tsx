import {
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

import { ResultFragment } from "../../../../../generated/graphql";
import { ComparisonOperator } from "../../../../../types";
import { getFormatValue } from "../../../ChartEditTab";

export interface MetricChartConfig {
  valueCol?: string;
  compareCol?: string;
  format?: string;
  threshold?: {
    value?: number;
    condition?: string;
    type?: string;
  };
}

interface MetricChartPreviewProps {
  result: ResultFragment;
  config: MetricChartConfig;
}

export const MetricChartPreview: FC<MetricChartPreviewProps> = ({
  result,
  config,
}) => {
  const value = useMemo(() => {
    const valueColIndex = result.fields.findIndex(
      (value) => value === config?.valueCol
    );

    if (valueColIndex >= 0) {
      return getFormatValue(result.values[0]?.[valueColIndex], config?.format);
    }

    return null;
  }, [result, config]);

  const isHighlightValue = useMemo(() => {
    if (
      config?.threshold?.condition &&
      config?.threshold?.type &&
      config?.threshold?.value !== undefined &&
      config?.threshold?.value !== null
    ) {
      const formatValue = getFormatValue(value);
      const compareValue = config.threshold.value;
      const isNumberType = config.threshold.type === "number";

      switch (config.threshold.condition) {
        case ComparisonOperator.GREATER:
          return (
            formatValue > (isNumberType ? compareValue : compareValue / 100)
          );
        case ComparisonOperator.LESS:
          return (
            formatValue < (isNumberType ? compareValue : compareValue / 100)
          );
        case ComparisonOperator.EQUAL:
          return (
            formatValue === (isNumberType ? compareValue : compareValue / 100)
          );
        case ComparisonOperator.NOT_EQUAL:
          return (
            formatValue !== (isNumberType ? compareValue : compareValue / 100)
          );
        case ComparisonOperator.GREAT_THAN_OR_EQUAL:
          return (
            formatValue >= (isNumberType ? compareValue : compareValue / 100)
          );
        case ComparisonOperator.LESS_THAN_OR_EQUAL:
          return (
            formatValue <= (isNumberType ? compareValue : compareValue / 100)
          );
        default:
          return false;
      }
    }

    return false;
  }, [
    config?.threshold?.condition,
    config?.threshold?.type,
    config?.threshold?.value,
    value,
  ]);

  const compareValue = useMemo(() => {
    const compareColIndex = result.fields.findIndex(
      (c) => c === config?.compareCol
    );

    if (compareColIndex >= 0) {
      return getFormatValue(
        result.values[0]?.[compareColIndex],
        config?.format
      );
    }

    return null;
  }, [result, config]);

  const isUpwardsTrend = useMemo(() => {
    return compareValue && value && value > compareValue;
  }, [value, compareValue]);

  return (
    <Flex
      h="full"
      align="center"
      px={{ base: "4", md: "6" }}
      py={{ base: "5", md: "6" }}
      borderRadius="lg"
    >
      <Stack>
        <Stack spacing="4">
          <Heading
            wordBreak="break-all"
            size={useBreakpointValue({ base: "sm", md: "md" })}
            color={isHighlightValue ? "red.500" : undefined}
          >
            {value}
          </Heading>

          {compareValue ? (
            <HStack spacing="1" fontWeight="medium">
              <Icon
                color={isUpwardsTrend ? "success" : "error"}
                as={isUpwardsTrend ? FiArrowUpRight : FiArrowDownRight}
                boxSize="5"
              />
              <Text
                wordBreak="break-all"
                color={isUpwardsTrend ? "success" : "error"}
              >
                {compareValue}
              </Text>
            </HStack>
          ) : null}
        </Stack>
      </Stack>
    </Flex>
  );
};
