import { FC } from "react";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { ResultPreview } from "../components/ResultPreview";
import { Loading } from "../components/Loading";
import { useQueryResult } from "../hooks/useQueryResult";

const ClipPreview: FC = () => {
  const { token } = useParams<{ token: string }>();

  const { data: result, isLoading } = useQueryResult(token);

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
