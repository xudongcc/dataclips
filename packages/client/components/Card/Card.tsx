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
  <Stack
    as="section"
    bg="bg-surface"
    boxShadow={useColorModeValue("sm", "sm-dark")}
    borderRadius="lg"
    className="card"
    spacing="5"
    p={{ base: "4", md: "6" }}
    {...otherProps}
  >
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

    <Box flex={1} className="card-body">
      {children}
    </Box>

    {/* <Stack direction={{ base: "column", md: "row" }} spacing="3">
          <Button variant="secondary">Skip</Button>
          <Button variant="primary">Download</Button>
        </Stack> */}
  </Stack>
);
