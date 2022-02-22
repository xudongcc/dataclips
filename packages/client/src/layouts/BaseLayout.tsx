import { FC } from 'react';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/apolloClient';
import { theme } from '@chakra-ui/pro-theme';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/queryClient';

const BaseLayout: FC = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider
          theme={extendTheme(theme, {
            config: {
              initialColorMode: 'system',
              useSystemColorMode: true,
            },
            styles: {
              global: () => ({
                '#root': {
                  height: 'full',
                },
              }),
            },
          })}
        >
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export default BaseLayout;
