import { FC } from "react";
import { Card, CardProps } from "../../common/Card";

export interface DashboardCardProps extends CardProps {}

export const DashboardCard: FC<DashboardCardProps> = (props) => {
  return (
    <Card
      size="small"
      bodyClassName="drag-item"
      bodyStyle={{ overflowY: "auto" }}
      ellipsisHeader={false}
      {...props}
    />
  );
};
