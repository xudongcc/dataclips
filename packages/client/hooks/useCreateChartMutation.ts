import {
  ChartConnectionDocument,
  ChartConnectionQuery,
  ChartConnectionQueryVariables,
  useCreateChartMutation as useBaseCreateChartMutation,
} from "../generated/graphql";

export const useCreateChartMutation = (): ReturnType<
  typeof useBaseCreateChartMutation
> => {
  return useBaseCreateChartMutation({
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
                edges: [
                  {
                    node: mutationResult.data.createChart,
                  },
                  ...cacheResult.chartConnection.edges,
                ],
              },
            },
          });
        }
      }
    },
  });
};
