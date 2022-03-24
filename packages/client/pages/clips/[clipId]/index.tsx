import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Loading } from "../../../components/Loading";
import { Page } from "../../../components/Page";
import { ResultPreview } from "../../../components/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";
import PreviewLayout from "../../../layouts/PreviewLayout";
import ProjectLayout from "../../../layouts/ProjectLayout";

const ClipPreview = () => {
  const router = useRouter();
  const session = useSession();

  const { clipId } = router.query as { clipId: string };

  const { data: result, isLoading } = useQueryResult(clipId);

  const content = useMemo(() => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <Page title={result?.name}>
        <ResultPreview token={clipId} result={result} />
      </Page>
    );
  }, [clipId, isLoading, result]);

  if (session.status === "authenticated") {
    return <ProjectLayout>{content}</ProjectLayout>;
  }

  return <PreviewLayout>{content}</PreviewLayout>;
};

export default ClipPreview;
