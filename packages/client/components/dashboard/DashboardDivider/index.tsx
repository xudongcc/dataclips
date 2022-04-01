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
    { orientation: "left", beforeWidth: "5%", afterWidth: "95%" },
    { orientation: "center", beforeWidth: "50%", afterWidth: "50%" },
    { orientation: "right", beforeWidth: "95%", afterWidth: "5%" },
  ].find((item) => item.orientation === orientation);

  return (
    <Box
      w="100%"
      d="flex"
      minW="100%"
      className="dashboard-card-body"
      my="16px"
      fontWeight="bold"
      fontSize="16px"
      whiteSpace="nowrap"
      _before={{
        position: "relative",
        top: "50%",
        width: orientationWidth.beforeWidth,
        borderTop: "1px solid red",
        borderTopColor: "inherit",
        borderBottom: 0,
        transform: "translateY(50%)",
        content: '""',
      }}
      _after={{
        position: "relative",
        top: "50%",
        width: orientationWidth.afterWidth,
        borderTop: "1px solid red",
        borderTopColor: "inherit",
        borderBottom: 0,
        transform: "translateY(50%)",
        content: '""',
      }}
      cursor="grab"
      userSelect="none"
    >
      {children && <Text px={4}>{children}</Text>}
    </Box>
  );
};
