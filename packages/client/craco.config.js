require('dotenv').config();

const CopyPlugin = require('copy-webpack-plugin');

const { SERVER_URL } = process.env;

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [
            {
              from: 'node_modules/monaco-editor/min/vs',
              to: 'monaco-editor/min/vs',
            },
          ],
        }),
      ],
    },
    configure: {
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: 'javascript/auto',
          },
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },
        ],
      },
    },
  },
  devServer: {
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
  },
};
