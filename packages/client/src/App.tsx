import { FC } from "react";
import { useRoutes } from "react-router-dom";
import ClipPreview from "./pages/ClipPreview";
import ClipEdit from "./pages/ClipEdit";

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
