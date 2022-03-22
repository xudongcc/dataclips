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
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: ButtonProps;
  secondaryActions?: ButtonProps[];
}

export const Page: FC<PageProps> = ({
  children,
  title,
  description,
  primaryAction,
  secondaryActions,
}) => {
  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        pb={4}
      >
        <Stack spacing="1">
          <Heading
            size={useBreakpointValue({ base: "xs", md: "sm" })}
            fontWeight="medium"
          >
            {title}
          </Heading>

          {description && <Text color="muted">{description}</Text>}
        </Stack>

        <Stack direction="row" spacing="3">
          {secondaryActions?.length &&
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
        </Stack>
      </Stack>

      {children}
    </Box>
  );
};
