import { RouteObject } from "react-router-dom";

import ChartEdit from "../pages/ChartEdit";
import { ChartList } from "../pages/ChartList";
import ChartPreview from "../pages/ChartPreview";
import ClipEdit from "../pages/ClipEdit";
import { ClipList } from "../pages/ClipList";
import ClipPreview from "../pages/ClipPreview";

export const routes: RouteObject[] = [
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
