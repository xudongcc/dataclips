import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FC } from 'react';
import { FiDownloadCloud } from 'react-icons/fi';
import { Card } from './components/Card';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

const ProjectLayout: FC = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Flex
      as="section"
      direction={{ base: 'column', lg: 'row' }}
      height="100vh"
      bg="bg-canvas"
      overflowY="auto"
    >
      {isDesktop ? <Sidebar /> : <Navbar />}

      <Container py="8" flex="1">
        {children}
      </Container>
    </Flex>
  );
};

export default ProjectLayout;
