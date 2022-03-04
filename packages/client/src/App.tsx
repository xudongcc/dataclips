import { FC } from "react";
import { useRoutes } from "react-router-dom";

import ClipEdit from "./pages/ClipEdit";
import ClipPreview from "./pages/ClipPreview";

export const App: FC = () => {
  const element = useRoutes([
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
  ]);

  return element;
};

export default App;
