import { QueryObserverOptions, useQuery } from "react-query";

export const useQueryResult = (
  idOrToken?: string,
  config?: QueryObserverOptions
) => {
  console.log("config", config);
  return useQuery(
    ["result", idOrToken],
    () => fetch(`/clips/${idOrToken}.json`).then((res) => res.json()),
    { refetchInterval: 1000 * 60, enabled: !!idOrToken, ...config }
  );
};
