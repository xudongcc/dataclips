require("dotenv").config();

const { SERVER_URL } = process.env;

module.exports = {
  schema: `${SERVER_URL}/api/graphql`,
  documents: ["./graphql/**/*.graphql"],
  overwrite: true,
  generates: {
    "./generated/graphql.ts": {
      plugins: [
        "fragment-matcher",
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        reactApolloVersion: 3,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        minify: true,
        namingConvention: {
          enumValues: "keep",
        },
      },
    },
  },
};
