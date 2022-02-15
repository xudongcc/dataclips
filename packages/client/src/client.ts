import { createStandaloneToast } from '@chakra-ui/react';
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import qs from 'qs';
import { history } from 'umi';

const toast = createStandaloneToast();

const tenantIdRegexp = /^\/projects\/(\d+)(\/?)/;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors && graphQLErrors.length > 0) {
        graphQLErrors.forEach((graphQLError) => {
          toast({
            title: graphQLError.message,
            status: 'error',
          });
          if (graphQLError.extensions?.code === 'UNAUTHORIZED') {
            if (window.location.pathname !== '/admin/auth/login') {
              history.replace({
                pathname: '/auth/login',
                search: qs.stringify({
                  redirect: window.location.href,
                }),
              });
            }
          }
          if (graphQLError.extensions?.code === 'FORBIDDEN') {
            // history.goBack();
            history.replace({
              pathname: '/auth/login',
              search: qs.stringify({
                redirect: window.location.href,
              }),
            });
          }
        });
      }

      if (networkError) {
        toast({
          title: networkError.message,
          status: 'error',
        });
        throw networkError;
      }
    }),
    setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(tenantIdRegexp.test(window.location.pathname)
            ? {
                'x-tenant-id': (
                  tenantIdRegexp.exec(window.location.pathname) as string[]
                )[1],
              }
            : {}),
        },
      };
    }),
    createHttpLink({
      uri: `/graphql`,
      credentials: 'include',
    }),
  ]),
});
