import { FC } from "react";
import { Card, CardProps } from "../../common/Card";

export interface DashboardCardProps extends CardProps {}

export const DashboardCard: FC<DashboardCardProps> = (props) => {
  return (
    <Card
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
      size="small"
      bodyStyle={{ overflowY: "auto" }}
      {...props}
    />
  );
};
