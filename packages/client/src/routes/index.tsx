import { RouteObject } from "react-router-dom";

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
    path: "/sources",
    element: <SourceList />,
  },
  {
    path: "/sources/create",
    element: <SourceCreate />,
  },
  {
    path: "/clips",
    element: <ClipList />,
  },
  {
    path: "/clips/create",
    element: <ClipEdit />,
  },
  {
    path: "/clips/:clipId/edit",
    element: <ClipEdit />,
  },
  {
    path: "/clips/:token",
    element: <ClipPreview />,
  },
  {
    path: "/charts",
    element: <ChartList />,
  },
  {
    path: "/charts/create",
    element: <ChartEdit />,
  },
  {
    path: "/charts/:chartId",
    element: <ChartPreview />,
  },
  {
    path: "/charts/:chartId/edit",
    element: <ChartEdit />,
  },
];
