import {
  split,
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createStandaloneToast } from "@chakra-ui/react";
import { pick } from "lodash";
import { GetServerSidePropsContext, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const toast = createStandaloneToast();

const createIsomorphLink = (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
): ApolloLink => {
  if (typeof window !== "undefined") {
    return ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors && graphQLErrors.length > 0) {
          graphQLErrors.forEach((graphQLError) => {
            toast({
              title: graphQLError.message,
              status: "error",
            });

            // if (graphQLError.extensions?.code === "UNAUTHORIZED") {
            //   if (window.location.pathname !== "/auth/login") {
            //     window.location.href = "/auth/login";
            //   }
            // }

            // if (graphQLError.extensions?.code === "FORBIDDEN") {
            //   window.location.href = "/auth/login";
            // }
          });
        }

        if (networkError) {
          toast({
            title: networkError.message,
            status: "error",
          });
          throw networkError;
        }
      }),
      // split(
      //   ({ query }) => {
      //     const definition = getMainDefinition(query);
      //     return (
      //       definition.kind === "OperationDefinition" &&
      //       definition.operation === "subscription"
      //     );
      //   },
      //   createHttpLink({
      //     uri: `/graphql`,
      //     credentials: "same-origin",
      //   })
      // ),
      createHttpLink({
        uri: `/graphql`,
        credentials: "same-origin",
      }),
    ]);
  } else {
    return ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        // if (graphQLErrors && graphQLErrors.length > 0) {
        //   if (
        //     graphQLErrors.find(
        //       (graphQLError) =>
        //         graphQLError.extensions?.code === "UNAUTHORIZED" ||
        //         graphQLError.extensions?.code === "FORBIDDEN"
        //     )
        //   ) {
        //     ctx?.res.writeHead(302, { location: "/auth/login" }).end();
        //     return;
        //   }

        //   throw graphQLErrors[0];
        // }

        if (networkError) {
          throw networkError;
        }
      }),
      setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            ...pick(ctx?.req.headers, ["cookie"]),
          },
        };
      }),
      createHttpLink({
        uri: `${process.env.SERVER_URL}/graphql`,
      }),
    ]);
  }
};

export type ApolloClientContext = GetServerSidePropsContext<ParsedUrlQuery>;

export const getApolloClient = (
  ctx?: ApolloClientContext,
  initialState?: NormalizedCacheObject
) => {
  const _apolloClient =
    apolloClient ??
    new ApolloClient({
      ssrMode: typeof window === "undefined",
      link: createIsomorphLink(ctx),
      cache: new InMemoryCache().restore(initialState || {}),
    });

  // 在 SSG 和 SSR 总是创建新的 Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }
  // 在客户端只创建一次 Apollo Client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
};
