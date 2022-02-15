import { FC } from 'react';
import { DataSourcePreview } from '@/components/DataSourcePreview';
import { useDataClipQuery } from '@/generated/graphql';
import { useParams } from 'umi';

const DataClipShow: FC = () => {
  const { dataClipId } = useParams<{ dataClipId: string }>();

  const { data, loading, error } = useDataClipQuery({
    variables: { id: dataClipId },
  });

  return data?.dataClip.result ? (
    <DataSourcePreview data={data.dataClip.result} />
  ) : null;
};

export default DataClipShow;
