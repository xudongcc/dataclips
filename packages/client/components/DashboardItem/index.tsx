import { Box } from "@chakra-ui/react";
import { CSSProperties, forwardRef, ReactNode } from "react";

interface DashboardItemProps {
  key?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const DashboardItem = forwardRef<any, DashboardItemProps>(
  ({ children, style, className, key, ...otherProps }, ref) => {
    return (
      <Box
        sx={{
          "& > .react-resizable-handle": {
            width: "40px",
            height: "40px",
            backgroundImage: "none",
          },
          "& > .react-resizable-handle::after": {
            width: "10px",
            height: "10px",
            right: "10px",
            bottom: "10px",
          },
          ".bizcharts": {
            height: "100% !important",
          },
        }}
        className={className}
        key={key}
        style={style}
        ref={ref}
        {...otherProps}
      >
        {children}
      </Box>
    );
  }
);

DashboardItem.displayName = "DashboardItem";
