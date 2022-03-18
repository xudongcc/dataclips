import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";
import { Navbar } from "./components/Navbar";

const ProjectLayout: FC = ({ children }) => {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Navbar />

      <Container maxW="var(--chakra-sizes-7xl)" p={4}>
        {children}
      </Container>
    </Box>
  );
};

export default ProjectLayout;
