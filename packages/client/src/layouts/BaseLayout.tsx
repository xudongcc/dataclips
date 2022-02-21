import '@fontsource/inter/variable.css';

import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/apolloClient';
import { theme } from '@chakra-ui/pro-theme';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/queryClient';

const BaseLayout: FC = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export default BaseLayout;
