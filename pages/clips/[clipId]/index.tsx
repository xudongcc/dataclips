import { useRouter } from "next/router";
import { Loading } from "../../../components/Loading";
import { ResultPreview } from "../../../components/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";

const ClipPreview = () => {
  const router = useRouter();
  const { clipId } = router.query as { clipId: string };

  const { data: result, isLoading } = useQueryResult(clipId);

  if (isLoading) {
    return <Loading />;
  }

  return <ResultPreview token={clipId} result={result} />;
};

export default ClipPreview;
