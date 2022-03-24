import {
  Box,
  BoxProps,
  Button,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";

export interface CardProps extends BoxProps {
  title?: string;
  description?: string;
}

export const Card: FC<CardProps> = ({
  title,
  description,
  children,
  ...otherProps
}) => (
  <Box
    as="section"
    bg="bg-surface"
    boxShadow={useColorModeValue("sm", "sm-dark")}
    borderRadius="lg"
    p={{ base: "4", md: "6" }}
    className="card"
    {...otherProps}
  >
    <Stack spacing="5">
      {title || description ? (
        <Stack spacing="1" className="card-head">
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

      <Box className="card-body">{children}</Box>

      {/* <Stack direction={{ base: "column", md: "row" }} spacing="3">
          <Button variant="secondary">Skip</Button>
          <Button variant="primary">Download</Button>
        </Stack> */}
    </Stack>
  </Box>
);
