import {
  DashboardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";

interface RouterProps {
  name: string;
  path: string;
  icon?: ReactNode;
  children?: Array<RouterProps>;
}

export const routes: RouterProps[] = [
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
];
