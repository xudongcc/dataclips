import { QueryObserverOptions, useQuery } from "react-query";
import { ResultFragment } from "../generated/graphql";

export const useQueryResult = (
  idOrToken?: string,
  config?: QueryObserverOptions<ResultFragment>
) => {
  return useQuery(
    ["result", idOrToken],
    () => fetch(`/clips/${idOrToken}.json`).then((res) => res.json()),
    { refetchInterval: 1000 * 60, enabled: !!idOrToken, ...config }
  );
};
