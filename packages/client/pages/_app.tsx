import "@fontsource/inter/variable.css";

import React, { useMemo, Fragment, FC } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { PC } from "../interfaces/PageComponent";
import { theme } from "../theme";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { getApolloClient } from "../lib/apolloClient";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../lib/queryClient";

const App: FC<AppProps & { Component: PC }> = ({
  Component,
  pageProps: { apolloState, session, ...pageProps },
}) => {
  const Layout = useMemo(
    () => Component.layout || Fragment,
    [Component.layout]
  );

  return (
    <>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>
          <ApolloProvider client={getApolloClient(null, apolloState)}>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </QueryClientProvider>
          </ApolloProvider>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
