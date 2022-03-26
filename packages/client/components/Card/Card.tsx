import {
  Box,
  BoxProps,
  Button,
  ButtonProps as BaseButtonProps,
  Stack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { omit } from "lodash";
import { FC, ReactNode } from "react";

interface ButtonProps extends BaseButtonProps {
  text?: React.ReactNode;
}
export interface CardProps extends BoxProps {
  title?: string;
  description?: string;
  extra?: ReactNode;
  primaryAction?: ButtonProps;
  secondaryActions?: ButtonProps[];
}

export const Card: FC<CardProps> = ({
  title,
  description,
  children,
  extra,
  secondaryActions,
  primaryAction,
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
    <Stack spacing="5">
      <Stack
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        spacing="5"
      >
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

        {extra}

        {!extra && (primaryAction || secondaryActions) && (
          <HStack spacing="1">
            {secondaryActions &&
              secondaryActions?.length &&
              secondaryActions.map((secondaryAction, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  {...omit(secondaryAction, "text")}
                >
                  {secondaryAction.text}
                </Button>
              ))}

            {primaryAction && (
              <Button variant="primary" {...omit(primaryAction, "text")}>
                {primaryAction?.text}
              </Button>
            )}
          </HStack>
        )}
      </Stack>
    </Stack>

    <Box
      flex={1}
      // 图表需要限制
      overflow="hidden"
      h="inherit"
      sx={{
        ".bizcharts": {
          height: "100% !important",
        },
      }}
      className="card-body"
    >
      {children}
    </Box>

    {/* <Stack direction={{ base: "column", md: "row" }} spacing="3">
      <Button variant="secondary">Skip</Button>
      <Button variant="primary">Download</Button>
    </Stack> */}
  </Stack>
);
