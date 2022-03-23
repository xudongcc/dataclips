import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { CSSProperties, forwardRef, ReactNode } from "react";

export interface CardProps {
  title?: string;
  description?: string;
  key?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Card = forwardRef<any, CardProps>(
  ({ title, description, children, className, style, ...rest }, ref) => {
    return (
      <Box as="section">
        <Box
          bg="bg-surface"
          className={className}
          ref={ref}
          {...rest}
          style={style}
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
        >
          <Stack spacing="5" height="100%">
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
  }
);

Card.displayName = "Card";
