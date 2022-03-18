import {
  Box,
  Button,
  ButtonProps as BaseButtonProps,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { omit } from "lodash";
import { FC } from "react";

interface ButtonProps extends BaseButtonProps {
  text?: React.ReactNode;
}

interface PageProps {
  primaryAction?: ButtonProps;
  secondActions?: ButtonProps[];
  description?: React.ReactNode;
  header?: React.ReactNode;
}

export const Page: FC<PageProps> = ({
  children,
  secondActions,
  primaryAction,
  description,
  header,
}) => {
  return (
    <Box as="section" bg="bg-surface" pb={{ base: "12", md: "24" }}>
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        pb={
          secondActions || primaryAction || description || header
            ? 4
            : undefined
        }
      >
        <Stack spacing="1">
          <Heading
            size={useBreakpointValue({ base: "xs", md: "sm" })}
            fontWeight="medium"
          >
            {header}
          </Heading>
          {description && <Text color="muted">{description}</Text>}
        </Stack>

        <Stack direction="row" spacing="3">
          {secondActions?.length &&
            secondActions.map((action, index) => (
              <Button key={index} variant="outline" {...omit(action, "text")}>
                {action.text}
              </Button>
            ))}

          {primaryAction && (
            <Button
              variant="solid"
              colorScheme="blue"
              {...omit(primaryAction, "text")}
            >
              {primaryAction?.text}
            </Button>
          )}
        </Stack>
      </Stack>

      {children}
    </Box>
  );
};
