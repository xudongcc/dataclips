import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

interface Props {
  label: string;
  value: string;
  delta: {
    value: string;
    isUpwardsTrend: boolean;
  };
}
export const Stat = (props: Props) => {
  const { label, value, delta, ...boxProps } = props;
  return (
    <Box
      px={{ base: "4", md: "6" }}
      py={{ base: "5", md: "6" }}
      borderRadius="lg"
      {...boxProps}
    >
      <Stack>
        <HStack justify="space-between">
          <Text fontSize="sm" color="muted">
            {label}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
            {value}
          </Heading>

          {delta.isUpwardsTrend !== undefined && (
            <Badge
              variant="subtle"
              colorScheme={delta.isUpwardsTrend ? "green" : "red"}
            >
              <HStack spacing="1">
                <Icon
                  as={delta.isUpwardsTrend ? FiArrowUpRight : FiArrowDownRight}
                />
                <Text>{delta.value}</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
      </Stack>
    </Box>
  );
};
