import { useRouter } from "next/router";
import { Loading } from "../../../components/Loading";
import { Page } from "../../../components/Page";
import { ResultPreview } from "../../../components/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";
import PreviewLayout from "../../../layouts/PreviewLayout";

const ClipPreview = () => {
  const router = useRouter();
  const { clipId } = router.query as { clipId: string };

  const { data: result, isLoading } = useQueryResult(clipId);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page title={result?.name}>
      <ResultPreview token={clipId} result={result} />
    </Page>
  );
};

ClipPreview.layout = PreviewLayout;

export default ClipPreview;
