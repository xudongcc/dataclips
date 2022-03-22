import {
  SourceConnectionQuery,
  SourceConnectionDocument,
  SourceConnectionQueryVariables,
  useCreateDatabaseSourceMutation as useBaseCreateDatabaseSourceMutation,
} from "../generated/graphql";

export const useCreateDatabaseSourceMutation = (): ReturnType<
  typeof useBaseCreateDatabaseSourceMutation
> => {
  return useBaseCreateDatabaseSourceMutation({
    update(cache, mutationResult) {
      if (mutationResult.data) {
        const sourceResult = cache.readQuery<
          SourceConnectionQuery,
          SourceConnectionQueryVariables
        >({
          query: SourceConnectionDocument,
          variables: { first: 100 },
        });

        if (sourceResult && sourceResult.sourceConnection.edges) {
          cache.writeQuery({
            query: SourceConnectionDocument,
            variables: {
              first: 100,
            },
            data: {
              ...sourceResult,
              sourceConnection: {
                ...sourceResult.sourceConnection,
                edges: [
                  {
                    node: {
                      ...mutationResult.data.createDatabaseSource,
                      typename:
                        mutationResult.data.createDatabaseSource.__typename,
                    },
                  },
                  ...sourceResult.sourceConnection.edges,
                ],
              },
            },
          });
        }
      }
    },
  });
};
