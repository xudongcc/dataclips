import { useRouter } from "next/router";
import { Loading } from "../../../components/common/Loading";
import { Page } from "../../../components/common/Page";
import { ResultPreview } from "../../../components/clip/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";
import ProjectLayout from "../../../layouts/ProjectLayout";
import Head from "next/head";

const ClipPreview = () => {
  const router = useRouter();

  const { clipId } = router.query as { clipId: string };

  const { data: result, isLoading } = useQueryResult(clipId);

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
};

ClipPreview.layout = ProjectLayout;

export default ClipPreview;
