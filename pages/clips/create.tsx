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
            isLoading={createClipLoading}
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
    </Flex>
  );
};

ClipCreate.layout = ProjectLayout;

export default ClipCreate;
