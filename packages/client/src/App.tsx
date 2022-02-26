import { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './libs/apolloClient';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './libs/queryClient';
import { useRoutes } from 'react-router-dom';
import { theme } from './theme';
import ClipPreview from './pages/ClipPreview';
import ClipEdit from './pages/ClipEdit';

export const App: FC = () => {
  const element = useRoutes([
    {
      path: '/clips/create',
      element: <ClipEdit />,
    },
    {
      path: '/clips/:slug',
      element: <ClipPreview />,
    },
    {
      path: '/clips/:clipId/edit',
      element: <ClipEdit />,
    },
  ]);

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          {element}
        </QueryClientProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
