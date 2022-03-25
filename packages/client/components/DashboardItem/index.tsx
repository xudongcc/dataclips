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
