import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";

export interface CardProps {
  title?: string;
  description?: string;
}

export const Card: FC<CardProps> = ({ title, description, children }) => (
  <Box as="section">
    <Box
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}
      borderRadius="lg"
      p={{ base: "4", md: "6" }}
    >
      <Stack spacing="5">
        {title || description ? (
          <Stack spacing="1">
            {title ? (
              <Text fontSize="lg" fontWeight="medium">
                {title}
              </Text>
            ) : null}

            {description ? (
              <Text fontSize="sm" color="muted">
                {description}
              </Text>
            ) : null}
          </Stack>
        ) : null}

        {children}

        {/* <Stack direction={{ base: "column", md: "row" }} spacing="3">
          <Button variant="secondary">Skip</Button>
          <Button variant="primary">Download</Button>
        </Stack> */}
      </Stack>
    </Box>
  </Box>
);
