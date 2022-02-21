import { defineConfig } from 'umi';

import routes from './routes';

const { SERVER_URL } = process.env;

export default defineConfig({
  routes,
  proxy: {
    '/graphql': {
      target: SERVER_URL,
      changeOrigin: true,
    },
    '/clips/*.{json,csv}': {
      target: SERVER_URL,
      changeOrigin: true,
    },
  },
  webpack5: {},
  chainWebpack(config) {
    config.module
      .rule('mjs-rule')
      .test(/.m?js/)
      .resolve.set('fullySpecified', false);
  },
});
