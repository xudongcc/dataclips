import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Loading } from "../../../components/Loading";
import { Page } from "../../../components/Page";
import { ResultPreview } from "../../../components/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";
import PreviewLayout from "../../../layouts/PreviewLayout";
import ProjectLayout from "../../../layouts/ProjectLayout";
import Head from "next/head";

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
      <>
        <Head>
          <title>{result?.name} - 预览 - 数据集</title>
        </Head>

        <Page
          title={result?.name}
          primaryAction={{
            text: "编辑",
            onClick: () => {
              router.push(`/clips/${clipId}/edit`);
            },
          }}
        >
          <ResultPreview token={clipId} result={result} />
        </Page>
      </>
    );
  }, [clipId, isLoading, result]);

  if (session.status === "authenticated") {
    return <ProjectLayout>{content}</ProjectLayout>;
  }

  return <PreviewLayout>{content}</PreviewLayout>;
};

export default ClipPreview;
