import "@fontsource/inter/variable.css";
import { theme } from "../theme";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useMemo, Fragment, FC } from "react";
import { AppProps } from "next/app";
import { PC } from "../interfaces/PageComponent";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { getApolloClient } from "../lib/apolloClient";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../lib/queryClient";
// import { ReactQueryDevtools } from "react-query/devtools";
import { ConfigProvider as AntdConfigProvider } from "antd";
import "../style/index.less";
import { ThemeProvider } from "styled-components";
import zhCN from "antd/lib/locale/zh_CN";

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
        <ThemeProvider theme={{}}>
          <AntdConfigProvider locale={zhCN}>
            <SessionProvider session={session}>
              <ApolloProvider client={getApolloClient(null, apolloState)}>
                <QueryClientProvider client={queryClient}>
                  <Layout>
                    <Component {...pageProps} />

                    {/* 调试的时候可打开 */}
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                  </Layout>
                </QueryClientProvider>
              </ApolloProvider>
            </SessionProvider>
          </AntdConfigProvider>
        </ThemeProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
