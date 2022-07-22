import { useRouter } from "next/router";
import { Loading } from "../../../components/common/Loading";
import { Page } from "../../../components/common/Page";
import { ResultPreview } from "../../../components/clip/ResultPreview";
import { useQueryResult } from "../../../hooks/useQueryResult";
import ProjectLayout from "../../../layouts/ProjectLayout";
import Head from "next/head";
import { useMemo, useState } from "react";
import { QueryObserverOptions } from "react-query";
import { ResultFragment, useClipQuery } from "../../../generated/graphql";
import { Switch } from "antd";

const ClipPreview = () => {
  const router = useRouter();

  const { clipId } = router.query as { clipId: string };

  const { data: { clip } = {} } = useClipQuery({
    variables: { id: clipId! },
    skip: !clipId,
  });

  // 请求根据设定的间隔自动重新获取
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  const refreshConfig: QueryObserverOptions<ResultFragment> = useMemo(() => {
    if (!autoRefreshEnabled) {
      return {
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      };
    }

    return {};
  }, [autoRefreshEnabled]);

  const { data: result, isLoading } = useQueryResult(clipId, refreshConfig);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{clip?.name} - 预览 - 数据集</title>
      </Head>

      <Page
        title={clip?.name}
        primaryAction={{
          text: "编辑",
          onClick: () => {
            router.push(`/clips/${clipId}/edit`);
          },
        }}
        extra={
          <Switch
            onChange={(checked) => {
              setAutoRefreshEnabled(checked);
            }}
            checked={autoRefreshEnabled}
            checkedChildren="自动刷新"
            unCheckedChildren="自动刷新"
          />
        }
      >
        <ResultPreview token={clipId} result={result} />
      </Page>
    </>
  );
};

ClipPreview.layout = ProjectLayout;

export default ClipPreview;
