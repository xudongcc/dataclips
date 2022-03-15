import { RouteObject } from "react-router-dom";

import ProjectLayout from "../layouts/ProjectLayout";
import ChartEdit from "../pages/Chart/ChartEdit";
import { ChartList } from "../pages/Chart/ChartList";
import ChartPreview from "../pages/Chart/ChartPreview";
import ClipEdit from "../pages/Clip/ClipEdit";
import { ClipList } from "../pages/Clip/ClipList";
import ClipPreview from "../pages/Clip/ClipPreview";
import { SourceCreate } from "../pages/Source/SourceCreate";
import { SourceList } from "../pages/Source/SourceList";

export const routes: RouteObject[] = [
  {
    path: "/charts/:chartId",
    element: <ChartPreview />,
  },
  {
    path: "/",
    element: <ProjectLayout />,
    children: [
      {
        path: "/sources",
        children: [
          {
            index: true,
            element: <SourceList />,
          },
          {
            path: "create",
            element: <SourceCreate />,
          },
        ],
      },
      {
        path: "/clips",
        children: [
          {
            index: true,
            element: <ClipList />,
          },
          {
            path: "create",
            element: <ClipEdit />,
          },
          {
            path: ":clipId/edit",
            element: <ClipEdit />,
          },
          {
            path: ":token",
            element: <ClipPreview />,
          },
        ],
      },
      {
        path: "charts",
        children: [
          {
            index: true,
            element: <ChartList />,
          },
          {
            path: "create",
            element: <ChartEdit />,
          },
          {
            path: ":chartId/edit",
            element: <ChartEdit />,
          },
        ],
      },
    ],
  },
];
