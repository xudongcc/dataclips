import { defineConfig } from 'umi';

import routes from './routes';

const { SERVER_URL } = process.env;

export default defineConfig({
  favicon: '/favicon.png',
  routes,
  copy: [
    {
      from: 'node_modules/monaco-editor/min/vs',
      to: 'monaco-editor/min/vs',
    },
  ],
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
  dynamicImport: {
    loading: '@/pages/Loading',
  },
  chunks: ['vendors', 'umi'],
  chainWebpack(config) {
    config.module
      .rule('mjs-rule')
      .test(/.m?js/)
      .resolve.set('fullySpecified', false);

    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }: { resource: string }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
});
