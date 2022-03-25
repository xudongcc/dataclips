import {
  Box,
  BoxProps,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CSSProperties, ReactNode, forwardRef } from "react";

export interface CardProps extends BoxProps {
  title?: string;
  description?: string;
  key?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  extra?: ReactNode;
}

export const Card = forwardRef<any, CardProps>(
  (
    { title, description, children, className, style, extra, ...otherProps },
    ref
  ) => {
    return (
      <Stack
        as="section"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        borderRadius="lg"
        className={`card ${className}`}
        spacing="5"
        style={style}
        ref={ref}
        p={{ base: "4", md: "6" }}
        {...otherProps}
      >
        <Stack spacing="1">
          <Flex alignItems="center" justifyContent="space-between">
            {title ? (
              <Text wordBreak="break-all" fontSize="lg" fontWeight="medium">
                {title}
              </Text>
            ) : null}

            {extra}
          </Flex>

          {description ? (
            <Text fontSize="sm" color="muted">
              {description}
            </Text>
          ) : null}
        </Stack>

        <Box flex={1} className="card-body">
          {children}
        </Box>

        {/* <Stack direction={{ base: "column", md: "row" }} spacing="3">
            <Button variant="secondary">Skip</Button>
            <Button variant="primary">Download</Button>
          </Stack> */}
      </Stack>
    );
  }
);

Card.displayName = "Card";
