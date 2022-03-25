import {
  DashboardConnectionDocument,
  DashboardConnectionQuery,
  DashboardConnectionQueryVariables,
  useCreateDashboardMutation as useBaseCreateDashboardMutation,
} from "../generated/graphql";

export const useCreateDashboardMutation = (): ReturnType<
  typeof useCreateDashboardMutation
> => {
  return useBaseCreateDashboardMutation({
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
                edges: [
                  {
                    node: mutationResult.data.createDashboard,
                  },
                  ...cacheResult.dashboardConnection.edges,
                ],
              },
            },
          });
        }
      }
    },
  });
};
