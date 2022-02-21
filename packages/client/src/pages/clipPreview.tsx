import { FC } from 'react';

import { useParams } from 'umi';
import { useQuery } from 'react-query';
import { ResultPreview } from '@/components/ResultPreview';
import { Spinner } from '@chakra-ui/react';

const ClipPreview: FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery(['result', slug], () =>
    fetch(`/clips/${slug}.json`).then((res) => res.json()),
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ResultPreview
      slug={slug}
      fields={data.fields}
      values={data.values}
      finishedAt={data.finishedAt}
    />
  );
};

export default ClipPreview;
