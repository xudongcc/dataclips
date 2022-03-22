import {
  SourceConnectionDocument,
  SourceConnectionQuery,
  SourceConnectionQueryVariables,
  useDeleteSourceMutation as useBaseDeleteSourceMutation,
} from "../generated/graphql";

export const useDeleteSourceMutation = (): ReturnType<
  typeof useBaseDeleteSourceMutation
> => {
  return useBaseDeleteSourceMutation({
    update(cache, mutationResult) {
      if (mutationResult.data) {
        const cacheResult = cache.readQuery<
          SourceConnectionQuery,
          SourceConnectionQueryVariables
        >({
          query: SourceConnectionDocument,
          variables: { first: 100 },
        });

        if (cacheResult && cacheResult.sourceConnection.edges) {
          cache.writeQuery({
            query: SourceConnectionDocument,
            variables: {
              first: 100,
            },
            data: {
              ...cacheResult,
              sourceConnection: {
                ...cacheResult.sourceConnection,
                edges: cacheResult.sourceConnection.edges.filter(
                  (item) => item.node.id !== mutationResult.data?.deleteSource
                ),
              },
            },
          });
        }
      }
    },
  });
};
