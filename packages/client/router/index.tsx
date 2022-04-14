import {
  DashboardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";

export interface ItemsProps {
  name: string;
  path: string;
  icon?: ReactNode;
  items?: Array<ItemsProps>;
}

export interface RouterProps {
  title?: string;
  items: ItemsProps[];
}

export const routes: RouterProps[] = [
  {
    items: [
      {
        name: "仪表盘",
        path: "/dashboards",
        icon: <DashboardOutlined />,
      },
      {
        name: "图表",
        path: "/charts",
        icon: <LineChartOutlined />,
      },
      {
        name: "数据集",
        path: "/clips",
        icon: <DatabaseOutlined />,
      },
      {
        name: "数据源",
        path: "/sources",
        icon: <NodeIndexOutlined />,
      },
    ],
  },
];
