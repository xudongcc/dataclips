import { isEmpty } from "lodash";
import { QueryObserverOptions, useQuery } from "react-query";
import { ResultFragment } from "../generated/graphql";
import qs from "qs";

interface Config extends QueryObserverOptions<ResultFragment> {
  queryParams?: Record<string, any>;
}

export const useQueryResult = (idOrToken?: string, config?: Config) => {
  let baseUrl = `/clips/${idOrToken}.json`;

  const { queryParams = {}, ...restConfig } = config;

  if (!isEmpty(queryParams)) {
    baseUrl += `?${qs.stringify(queryParams)}`;
  }

  return useQuery(
    ["result", idOrToken],
    () => fetch(baseUrl).then((res) => res.json()),
    { refetchInterval: 1000 * 60, enabled: !!idOrToken, ...restConfig }
  );
};
