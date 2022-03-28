import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";

const PreviewLayout: FC = ({ children }) => {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Container maxW="var(--chakra-sizes-7xl)" p={4}>
        {children}
      </Container>
    </Box>
  );
};

export default PreviewLayout;
