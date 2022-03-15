import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import { ResultPreview } from "../../components/ResultPreview";
import { SQLEditor } from "../../components/SQLEditor";
import {
  useClipQuery,
  useCreateClipMutation,
  useSourceConnectionQuery,
  useUpdateClipMutation,
} from "../../generated/graphql";
import { useQueryResult } from "../../hooks/useQueryResult";

const ClipEdit: FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { clipId } = useParams<{ clipId: string }>();

  const [createClip, { loading: createClipLoading }] = useCreateClipMutation();
  const [updateClip, { loading: updateClipLoading }] = useUpdateClipMutation();

  const { data: { clip } = {}, loading: isClipLoading } = useClipQuery({
    variables: { id: clipId! },
    skip: !clipId,
  });

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 20 } });

  const { data: result, isLoading: isResultLoading } = useQueryResult(clipId);

  const handleSubmit = useCallback(
    async (input) => {
      if (clipId) {
        await updateClip({ variables: { id: clipId, input } });

        toast({
          title: "保存成功",
          status: "success",
        });
      } else {
        try {
          const { data } = await createClip({ variables: { input } });
          navigate(`/clips/${data?.createClip.id}/edit`);
        } catch (err) {
          //
        }
      }
    },
    [clipId, createClip, navigate, updateClip]
  );

  const form = useFormik({
    initialValues: {
      name: "",
      sql: "",
      sourceId: "",
    },
    onSubmit: handleSubmit,
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

  return (
    <>
      <Helmet>
        <title>{clip?.name ? `${clip.name} | 数据剪藏` : `数据剪藏`}</title>
      </Helmet>
      <Flex h="full" direction="column">
        <form onSubmit={form.handleSubmit}>
          <Stack p={4} spacing={3} direction="row">
            <Input
              size="sm"
              borderRadius="md"
              placeholder="请输入剪藏名称"
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
              placeholder="请选择数据源"
              isDisabled={isSourcesLoading}
            >
              {sourceConnection?.edges?.map(({ node }) => {
                return (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                );
              })}
            </Select>

            <Button
              size="sm"
              type="submit"
              colorScheme="blue"
              isLoading={createClipLoading && updateClipLoading}
            >
              保存
            </Button>
          </Stack>

          <Box
            borderTopWidth={1}
            borderBottomWidth={1}
            borderStyle="solid"
            borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
          >
            <SQLEditor
              value={form.values.sql}
              onChange={(value) => form.setFieldValue("sql", value)}
            />
          </Box>
        </form>

        <Box flex={1}>
          {result ? (
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            <ResultPreview token={clip?.token!} result={result} />
          ) : null}
        </Box>
      </Flex>
    </>
  );
};

export default ClipEdit;
