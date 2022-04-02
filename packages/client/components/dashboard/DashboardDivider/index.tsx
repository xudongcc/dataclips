import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

interface DashboardDividerProps {
  orientation?: "left" | "center" | "right";
  hasDelete?: boolean;
  onDelete?: () => void;
}

export const DashboardDivider: FC<DashboardDividerProps> = ({
  orientation = "left",
  children,
  hasDelete,
  onDelete,
}) => {
  const orientationWidth = [
    { orientation: "left", beforeWidth: "5%", afterWidth: "95%" },
    { orientation: "center", beforeWidth: "50%", afterWidth: "50%" },
    { orientation: "right", beforeWidth: "95%", afterWidth: "5%" },
  ].find((item) => item.orientation === orientation);

  return (
    <Flex
      className="dashboard-card-body"
      my="16px"
      fontWeight="bold"
      fontSize="20px"
      alignItems="center"
      whiteSpace="nowrap"
      userSelect="none"
    >
      <Box
        borderTop="1px solid transparent"
        borderTopColor="inherit"
        w={orientationWidth.beforeWidth}
      />
      {children && <Text px={4}>{children}</Text>}

      <Box
        borderTop="1px solid transparent"
        borderTopColor="inherit"
        w={orientationWidth.afterWidth}
      />

      {hasDelete && (
        <Box px={4}>
          <DeleteIcon
            onClick={() => {
              onDelete?.();
            }}
            cursor="pointer"
            color="gray.500"
          />
        </Box>
      )}
    </Flex>
  );
};
