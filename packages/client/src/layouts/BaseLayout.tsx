import '@fontsource/inter/variable.css';

import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/client';
import { theme } from '@chakra-ui/pro-theme';

const BaseLayout: FC = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ApolloProvider>
  );
};

export default BaseLayout;
