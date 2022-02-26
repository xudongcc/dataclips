import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { theme } from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./libs/apolloClient";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./libs/queryClient";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ChakraProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
