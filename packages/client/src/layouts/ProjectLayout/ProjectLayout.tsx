import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Navbar } from "./components/Navbar";

const ProjectLayout = () => {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Navbar />

      <Container maxW="var(--chakra-sizes-7xl)" p={4}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default ProjectLayout;
