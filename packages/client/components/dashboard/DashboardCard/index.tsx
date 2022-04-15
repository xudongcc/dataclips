import { FC } from "react";
import { AntdCard, AntdCardProps } from "../../common/AntdCard";

export interface DashboardCardProps extends AntdCardProps {}

export const DashboardCard: FC<DashboardCardProps> = (props) => {
  return (
    <AntdCard
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
      size="small"
      bodyStyle={{ overflowY: "auto" }}
      {...props}
    />
  );
};
