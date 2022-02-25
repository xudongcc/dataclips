import { FC } from 'react';

import { useParams } from 'umi';
import { useQuery } from 'react-query';
import { ResultPreview } from '@/components/ResultPreview';
import { Helmet } from 'react-helmet';
import { Loading } from '@/components/Loading';

const ClipPreview: FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: result, isLoading } = useQuery(['result', slug], () =>
    fetch(`/clips/${slug}.json`).then((res) => res.json()),
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{result.name ? `${result.name} | 数据剪藏` : `数据剪藏`}</title>
      </Helmet>

      <ResultPreview slug={slug} result={result} />
    </>
  );
};

export default ClipPreview;
