import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FC } from "react";

export interface PageProps {
  title: string;
}

export const Page: FC<PageProps> = ({ title, children }) => {
  return (
    <Stack spacing={{ base: "8", lg: "6" }}>
      <Stack
        spacing="4"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align={{ base: "start", lg: "center" }}
      >
        <Stack spacing="1">
          <Heading
            size={useBreakpointValue({ base: "xs", lg: "sm" })}
            fontWeight="medium"
          >
            {title}
          </Heading>
          <Text color="muted">All important metrics at a glance</Text>
        </Stack>
        <HStack spacing="3">
          <Button
            variant="secondary"
            leftIcon={<DownloadIcon fontSize="1.25rem" />}
          >
            Download
          </Button>
          <Button variant="primary">Create</Button>
        </HStack>
      </Stack>
      <Stack spacing={{ base: "5", lg: "6" }}>{children}</Stack>
    </Stack>
  );
};
