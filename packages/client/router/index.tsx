import {
  DashboardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";

interface ItemsProps {
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
    title: "qwe",
    items: [
      {
        name: "仪表盘",
        path: "/dashboards",
        icon: <DashboardOutlined />,
        items: [
          {
            name: "图表1",
            path: "/charts",
            icon: <LineChartOutlined />,
          },
          {
            name: "数据集1",
            path: "/clips",
            icon: <DatabaseOutlined />,
          },
          {
            name: "数据源1",
            path: "/sources",
            icon: <NodeIndexOutlined />,
            items: [
              {
                name: "图表1",
                path: "/charts",
                icon: <LineChartOutlined />,
              },
              {
                name: "数据集1",
                path: "/clips",
                icon: <DatabaseOutlined />,
              },
              {
                name: "数据源1",
                path: "/sources",
                icon: <NodeIndexOutlined />,
              },
            ],
          },
        ],
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

  {
    title: "123",
    items: [
      {
        name: "数据源2",
        path: "/sources2",
        icon: <NodeIndexOutlined />,
      },
    ],
  },

  {
    title: "asdasd",
    items: [
      {
        name: "数据源23",
        path: "/sources2",
        icon: <NodeIndexOutlined />,
      },
    ],
  },
];
