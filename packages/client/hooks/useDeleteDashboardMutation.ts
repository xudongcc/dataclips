import {
  DashboardConnectionDocument,
  DashboardConnectionQuery,
  DashboardConnectionQueryVariables,
  useDeleteDashboardMutation as useBaseDeleteDashboardMutation,
} from "../generated/graphql";

export const useDeleteDashboardMutation = (): ReturnType<
  typeof useDeleteDashboardMutation
> => {
  return useBaseDeleteDashboardMutation({
    update(cache, mutationResult) {
      if (mutationResult.data) {
        const cacheResult = cache.readQuery<
          DashboardConnectionQuery,
          DashboardConnectionQueryVariables
        >({
          query: DashboardConnectionDocument,
          variables: { first: 100 },
        });

        if (cacheResult && cacheResult.dashboardConnection.edges) {
          cache.writeQuery({
            query: DashboardConnectionDocument,
            variables: {
              first: 100,
            },
            data: {
              ...cacheResult,
              dashboardConnection: {
                ...cacheResult.dashboardConnection,
                edges: cacheResult.dashboardConnection.edges.filter(
                  (item) =>
                    item.node.id !== mutationResult.data?.deleteDashboard
                ),
              },
            },
          });
        }
      }
    },
  });
};
