import { FC, useEffect } from 'react';

import { useParams } from 'umi';
import { useQuery } from 'react-query';
import { ResultPreview } from '@/components/ResultPreview';
import { Box, Button, Select, Input, Spinner, Stack } from '@chakra-ui/react';
import {
  useClipQuery,
  useSourceConnectionQuery,
  useUpdateClipMutation,
} from '@/generated/graphql';
import { SQLEditor } from '@/components/SQLEditor';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet';

const ClipEdit: FC = () => {
  const { clipId } = useParams<{ clipId: string }>();

  const [updateClip, { loading: updateClipLoading }] = useUpdateClipMutation();

  const { data: { clip } = {}, loading: isClipLoading } = useClipQuery({
    variables: { id: clipId },
  });

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 20 } });

  const { data: result, isLoading: isResultLoading } = useQuery(
    ['result', clip?.slug],
    () => fetch(`/clips/${clip?.slug}.json`).then((res) => res.json()),
    { enabled: !!clip?.slug },
  );

  const form = useFormik({
    initialValues: {
      name: '',
      sql: '',
      sourceId: '',
    },
    onSubmit: async (input) => {
      await updateClip({ variables: { id: clipId, input } });
    },
  });

  useEffect(() => {
    if (clip) {
      form.setValues({
        name: clip.name,
        sql: clip.sql,
        sourceId: clip.sourceId,
      });
    }
  }, [clip]);

  if (clip && result) {
    return (
      <>
        <Helmet>
          <title>{clip.name ? `${clip.name} | 数据剪藏` : `数据剪藏`}</title>
        </Helmet>

        <Box bgColor="white">
          <form onSubmit={form.handleSubmit}>
            <Stack p={4} spacing={3} direction="row">
              <Input
                size="sm"
                borderRadius="md"
                placeholder="请输入剪辑名称"
                name="name"
                width="30%"
                onChange={form.handleChange}
                value={form.values.name}
              />

              <Select
                size="sm"
                borderRadius="md"
                name="sourceId"
                flex="1"
                value={form.values.sourceId}
                onChange={form.handleChange}
                placeholder="选择数据源"
              >
                {sourceConnection?.edges?.map(({ node }) => {
                  return <option value={node.id}>{node.name}</option>;
                })}
              </Select>

              <Button
                size="sm"
                type="submit"
                colorScheme="blue"
                isLoading={updateClipLoading}
              >
                保存
              </Button>
            </Stack>

            <Box borderWidth={1} borderY="solid" borderColor="gray.200">
              <SQLEditor
                value={form.values.sql}
                onChange={(value) => form.setFieldValue('sql', value)}
              />
            </Box>
          </form>

          <ResultPreview
            slug={clip.slug}
            fields={result.fields}
            values={result.values}
            duration={result.duration}
            finishedAt={result.finishedAt}
          />
        </Box>
      </>
    );
  }

  return <Spinner />;
};

export default ClipEdit;
