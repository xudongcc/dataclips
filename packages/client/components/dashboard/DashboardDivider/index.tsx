import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

interface DashboardDividerProps {
  orientation?: "left" | "center" | "right";
}

export const DashboardDivider: FC<DashboardDividerProps> = ({
  orientation = "left",
  children,
}) => {
  const orientationWidth = [
    { orientation: "left", beforeWidth: "5%", afterWidth: "88%" },
    { orientation: "center", beforeWidth: "50%", afterWidth: "50%" },
    { orientation: "right", beforeWidth: "88%", afterWidth: "5%" },
  ].find((item) => item.orientation === orientation);

  return (
    <Box
      w="100%"
      d="flex"
      minW="100%"
      position="relative"
      className="dashboard-card-body"
      my="16px"
      fontWeight="bold"
      fontSize="16px"
      whiteSpace="nowrap"
      _before={{
        position: "relative",
        top: "50%",
        width: orientationWidth.beforeWidth,
        borderTop: "1px solid transparent",
        borderTopColor: "inherit",
        borderBottom: 0,
        transform: "translateY(50%)",
        content: '""',
      }}
      _after={{
        position: "relative",
        top: "50%",
        width: orientationWidth.afterWidth,
        borderTop: "1px solid transparent",
        borderTopColor: "inherit",
        borderBottom: 0,
        transform: "translateY(50%)",
        content: '""',
      }}
      cursor="grab"
      userSelect="none"
    >
      {children && <Text px={4}>{children}</Text>}

      <DeleteIcon
        cursor="pointer"
        position="absolute"
        right="0"
        color="gray.500"
        transform="translateY(25%)"
        overflow="hidden"
        zIndex={100}
      />
    </Box>
  );
};
