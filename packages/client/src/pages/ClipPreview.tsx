import { FC } from 'react';

import { useParams } from 'umi';
import { useQuery } from 'react-query';
import { ResultPreview } from '@/components/ResultPreview';
import { Helmet } from 'react-helmet';
import { Loading } from '@/components/Loading';

const ClipPreview: FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: result, isLoading } = useQuery(['result', slug], () =>
    fetch(`/clips/${slug}.json`)
      .then((res) => res.json())
      .then((res) => {
        // table 的所需要的数据
        res.tableValues = res.values.map((value: Array<Array<any>>) => {
          const item: Record<string, any> = {};

          res.fields.forEach((key: string, index: number) => {
            item[key] = value[index];
          });

          return item;
        });

        // 生成 columns
        res.columns = res.fields.map((value: string) => ({
          Header: value,
          accessor: value,
        }));

        return res;
      }),
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
