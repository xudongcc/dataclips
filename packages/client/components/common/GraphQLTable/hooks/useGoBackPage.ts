import qs from "qs";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useGoBackPage = (pathname: string, id: string): (() => void) => {
  const navigate = useNavigate();

  return useCallback(
    () =>
      navigate(
        `${pathname}?${qs.stringify(
          JSON.parse(
            localStorage.getItem(`graphql-table-query-params:${id}`) || "{}"
          )
        )}`
      ),
    [navigate, id, pathname]
  );
};
