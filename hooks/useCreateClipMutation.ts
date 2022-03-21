import {
  ClipConnectionDocument,
  ClipConnectionQuery,
  ClipConnectionQueryVariables,
  useCreateClipMutation as useBaseCreateClipMutation,
} from "../generated/graphql";

export const useCreateClipMutation = (): ReturnType<
  typeof useBaseCreateClipMutation
> => {
  return useBaseCreateClipMutation({
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
                edges: [
                  {
                    node: mutationResult.data.createClip,
                  },
                  ...cacheResult.clipConnection.edges,
                ],
              },
            },
          });
        }
      }
    },
  });
};
