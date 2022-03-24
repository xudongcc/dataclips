import { QueryObserverBaseResult, useQuery } from "react-query";
import { useCallback, useEffect, useState, useRef } from "react";

export const useLazyQueryResult: () => [
  (idOrToken: string) => Promise<Record<string, any>>,
  Omit<QueryObserverBaseResult, "refetch">
] = () => {
  // 作用就是更新 refetch 的结果。。。
  const [count, setCount] = useState(0);
  const nextDataRef = useRef(null);
  const hasNewData = useRef(false);
  const idOrTokenRef = useRef("");

  const { refetch, ...rest } = useQuery(
    ["result", idOrTokenRef.current],
    () =>
      fetch(`/clips/${idOrTokenRef.current}.json`).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        nextDataRef.current = data;
        hasNewData.current = true;
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  useEffect(() => {
    if (count && idOrTokenRef.current) {
      refetch();
    }
  }, [count, refetch]);

  const fn = useCallback(async (idOrToken: string) => {
    if (idOrTokenRef.current) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn(idOrToken));
        }, 300);
      });
    } else {
      idOrTokenRef.current = idOrToken;
      setCount((pre) => pre + 1);
    }

    return new Promise<Record<string, any>>((resolve) => {
      setTimeout(() => {
        if (hasNewData.current) {
          resolve(nextDataRef.current);

          hasNewData.current = false;
          nextDataRef.current = null;
          idOrTokenRef.current = "";
        } else {
          return fn(idOrToken);
        }
      }, 100);
    });
  }, []);

  return [fn, rest];
};
