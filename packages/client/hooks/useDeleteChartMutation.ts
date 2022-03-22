import {
  ChartConnectionDocument,
  ChartConnectionQuery,
  ChartConnectionQueryVariables,
  useDeleteChartMutation as useBaseDeleteChartMutation,
} from "../generated/graphql";

export const useDeleteChartMutation = (): ReturnType<
  typeof useBaseDeleteChartMutation
> => {
  return useBaseDeleteChartMutation({
    update(cache, mutationResult) {
      if (mutationResult.data) {
        const cacheResult = cache.readQuery<
          ChartConnectionQuery,
          ChartConnectionQueryVariables
        >({
          query: ChartConnectionDocument,
          variables: { first: 100 },
        });

        if (cacheResult && cacheResult.chartConnection.edges) {
          cache.writeQuery({
            query: ChartConnectionDocument,
            variables: {
              first: 100,
            },
            data: {
              ...cacheResult,
              chartConnection: {
                ...cacheResult.chartConnection,
                edges: cacheResult.chartConnection.edges.filter(
                  (item) => item.node.id !== mutationResult.data?.deleteChart
                ),
              },
            },
          });
        }
      }
    },
  });
};
