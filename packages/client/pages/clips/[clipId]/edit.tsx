import ProjectLayout from "../../../layouts/ProjectLayout";
import { useRouter } from "next/router";
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
import { useCallback, useEffect } from "react";
import {
  useUpdateClipMutation,
  useClipQuery,
  useSourceConnectionQuery,
} from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { useFormik } from "formik";
import { ResultPreview } from "../../../components/ResultPreview";
import { SQLEditor } from "../../../components/SQLEditor";
import { Page } from "../../../components/Page";
import { Card } from "../../../components/Card";

const ClipEdit = () => {
  const toast = useToast();
  const router = useRouter();
  const { clipId } = router.query as { clipId: string };

  const [updateClip, { loading: updateClipLoading }] = useUpdateClipMutation();

  const { data: { clip } = {} } = useClipQuery({
    variables: { id: clipId! },
    skip: !clipId,
  });

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 20 } });

  const { data: result } = useQueryResult(clipId);

  const handleSubmit = useCallback(
    async (input) => {
      if (clipId) {
        await updateClip({ variables: { id: clipId, input } });

        toast({
          title: "保存成功",
          status: "success",
        });
      }
    },
    [clipId, toast, updateClip]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip]);

  return (
    <Page title={result?.name}>
      <Stack spacing={4}>
        <Card>
          <Flex h="full" direction="column">
            <form onSubmit={form.handleSubmit}>
              <Stack mb={4} spacing={3} direction="row">
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
                  isLoading={updateClipLoading}
                >
                  保存
                </Button>
              </Stack>

              <Box
                borderWidth={1}
                borderStyle="solid"
                borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
                borderRadius="md"
                overflow="hidden"
              >
                <SQLEditor
                  value={form.values.sql}
                  onChange={(value) => form.setFieldValue("sql", value)}
                />
              </Box>
            </form>
          </Flex>
        </Card>

        <Box flex={1}>
          {result && !result?.message ? (
            <ResultPreview token={clip?.token!} result={result} />
          ) : null}
        </Box>
      </Stack>
    </Page>
  );
};

ClipEdit.layout = ProjectLayout;

export default ClipEdit;
