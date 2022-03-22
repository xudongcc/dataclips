import {
  ClipConnectionDocument,
  ClipConnectionQuery,
  ClipConnectionQueryVariables,
  useDeleteClipMutation as useBaseDeleteClipMutation,
} from "../generated/graphql";

export const useDeleteClipMutation = (): ReturnType<
  typeof useBaseDeleteClipMutation
> => {
  return useBaseDeleteClipMutation({
    update(cache, mutationResult) {
      if (mutationResult.data) {
        const cacheResult = cache.readQuery<
          ClipConnectionQuery,
          ClipConnectionQueryVariables
        >({
          query: ClipConnectionDocument,
          variables: { first: 100 },
        });

        if (cacheResult && cacheResult.clipConnection.edges) {
          cache.writeQuery({
            query: ClipConnectionDocument,
            variables: {
              first: 100,
            },
            data: {
              ...cacheResult,
              clipConnection: {
                ...cacheResult.clipConnection,
                edges: cacheResult.clipConnection.edges.filter(
                  (item) => item.node.id !== mutationResult.data?.deleteClip
                ),
              },
            },
          });
        }
      }
    },
  });
};
