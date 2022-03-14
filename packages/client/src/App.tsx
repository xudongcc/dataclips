import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";
import { useMatch, useRoutes } from "react-router-dom";

import { Navbar } from "./layouts/components";
import { routes } from "./routes";

export const App: FC = () => {
  // 预览路由不需要布局外壳，v6 不支持精确匹配属性，create 路由也会包含其中
  const previewAndCreateRoute = useMatch("/charts/:chartId");

  const element = useRoutes(routes);

  return (
    <Box as="section" height="100vh" overflowY="auto">
      {(previewAndCreateRoute &&
        previewAndCreateRoute.params.chartId === "create") ||
      !previewAndCreateRoute ? (
        <>
          <Navbar />

          <Container maxW="var(--chakra-sizes-7xl)" p={4}>
            {element}
          </Container>
        </>
      ) : (
        element
      )}
    </Box>
  );
};

export default App;
