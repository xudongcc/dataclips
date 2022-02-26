import { FC } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { ResultPreview } from "../components/ResultPreview";
import { Helmet } from "react-helmet-async";
import { Loading } from "../components/Loading";

const ClipPreview: FC = () => {
  const { token } = useParams<{ token: string }>();

  const { data: result, isLoading } = useQuery(["result", token], () =>
    fetch(`/clips/${token}.json`).then((res) => res.json())
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{result.name ? `${result.name} | 数据剪藏` : `数据剪藏`}</title>
      </Helmet>

      <ResultPreview token={token} result={result} />
    </>
  );
};

export default ClipPreview;
