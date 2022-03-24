import ProjectLayout from "../../layouts/ProjectLayout";
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
import { useSourceConnectionQuery } from "../../generated/graphql";
import { useCallback } from "react";
import { useFormik } from "formik";
import { SQLEditor } from "../../components/SQLEditor";
import { useCreateClipMutation } from "../../hooks/useCreateClipMutation";
import { Card } from "../../components/Card/Card";
import { Page } from "../../components/Page";

const ClipCreate = () => {
  const toast = useToast();
  const router = useRouter();

  const [createClip, { loading: createClipLoading }] = useCreateClipMutation();

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 20 } });

  const handleSubmit = useCallback(
    async (input) => {
      try {
        const { data } = await createClip({ variables: { input } });
        toast({
          title: "创建成功",
          status: "success",
        });

        router.push(`/clips/${data?.createClip.id}/edit`);
      } catch (err) {
        //
      }
    },
    [createClip, router, toast]
  );

  const form = useFormik({
    initialValues: {
      name: "",
      sql: "",
      sourceId: "",
    },
    onSubmit: handleSubmit,
  });

  return (
    <Page title="创建数据集">
      <Card>
        <Flex h="full" direction="column">
          <form onSubmit={form.handleSubmit}>
            <Stack mb={4} spacing={3} direction="row">
              <Input
                placeholder="请输入名称"
                name="name"
                width="30%"
                onChange={form.handleChange}
                value={form.values.name}
              />

              <Select
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
                type="submit"
                variant="primary"
                isLoading={createClipLoading}
              >
                保存
              </Button>
            </Stack>

            <Box
              borderWidth={1}
              borderStyle="solid"
              borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
              borderRadius="lg"
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
    </Page>
  );
};

ClipCreate.layout = ProjectLayout;

export default ClipCreate;
