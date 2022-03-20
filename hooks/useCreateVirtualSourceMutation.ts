import {
  SourceConnectionQuery,
  SourceConnectionDocument,
  SourceConnectionQueryVariables,
  useCreateVirtualSourceMutation as useBaseCreateVirtualSourceMutation,
} from "../generated/graphql";

export const useCreateVirtualSourceMutation = (): ReturnType<
  typeof useBaseCreateVirtualSourceMutation
> => {
  return useBaseCreateVirtualSourceMutation({
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
                      ...mutationResult.data.createVirtualSource,
                      typename:
                        mutationResult.data.createVirtualSource.__typename,
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
