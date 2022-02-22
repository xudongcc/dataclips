import { FC } from 'react';

import { useParams } from 'umi';
import { useQuery } from 'react-query';
import { ResultPreview } from '@/components/ResultPreview';
import { Spinner } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

const ClipPreview: FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery(['result', slug], () =>
    fetch(`/clips/${slug}.json`).then((res) => res.json()),
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>{data.name ? `${data.name} | Dataclips` : `Dataclips`}</title>
      </Helmet>

      <ResultPreview
        slug={slug}
        fields={data.fields}
        values={data.values}
        duration={data.duration}
        finishedAt={data.finishedAt}
      />
    </>
  );
};

export default ClipPreview;
