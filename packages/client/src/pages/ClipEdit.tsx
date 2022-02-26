import { FC, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { ResultPreview } from "../components/ResultPreview";
import {
  Box,
  Button,
  Select,
  Input,
  Stack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useClipQuery,
  useSourceConnectionQuery,
  useCreateClipMutation,
  useUpdateClipMutation,
} from "../generated/graphql";
import { SQLEditor } from "../components/SQLEditor";
import { useFormik } from "formik";
import { Helmet } from "react-helmet-async";

const ClipEdit: FC = () => {
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

  const { data: result, isLoading: isResultLoading } = useQuery(
    ["result", clip?.id],
    () => fetch(`/clips/${clip?.id}.json`).then((res) => res.json()),
    { enabled: !!clip?.id }
  );

  const form = useFormik({
    initialValues: {
      name: "",
      sql: "",
      sourceId: "",
    },
    onSubmit: async (input) => {
      if (clipId) {
        await updateClip({ variables: { id: clipId, input } });
      } else {
        try {
          const { data } = await createClip({ variables: { input } });
          navigate(`/clips/${data?.createClip.id}/edit`);
        } catch (err) {
          //
        }
      }
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
  }, [clip, form]);

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
            <ResultPreview token={clip?.token} result={result} />
          ) : null}
        </Box>
      </Flex>
    </>
  );
};

export default ClipEdit;
