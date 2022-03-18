import { useQuery } from "react-query";

export const useQueryResult = (idOrToken?: string) => {
  return useQuery(
    ["result", idOrToken],
    () => fetch(`/clips/${idOrToken}.json`).then((res) => res.json()),
    { refetchInterval: 1000 * 60, enabled: !!idOrToken }
  );
};
