import { MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Select,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { useClipConnectionQuery } from "../../../generated/graphql";

interface VirtualSourceFormProps {
  form: any;
}

export const VirtualSourceForm: FC<VirtualSourceFormProps> = ({ form }) => {
  const { data } = useClipConnectionQuery({ variables: { first: 100 } });

  const clipIds = useMemo(() => {
    if (data?.clipConnection.edges?.length) {
      return data.clipConnection.edges.map((item) => ({
        id: item.node.id,
        name: item.node.name,
      }));
    }

    return [];
  }, [data]);

  return (
    <>
      <FormControl isInvalid={!!form.errors.virtualSource?.name}>
        <Input
          name="virtualSource.name"
          value={form.values.virtualSource.name}
          onChange={form.handleChange}
          placeholder="请输入数据源名字"
        ></Input>
        <FormErrorMessage>请输入数据源名字</FormErrorMessage>
      </FormControl>

      {form.values?.virtualSource?.tables?.map(
        (_: { clipId: string; name: string }, index: number) => (
          <HStack key={index} spacing={4} w="100%" alignItems="flex-start">
            <FormControl
              isInvalid={!!form.errors.virtualSource?.tables[index]?.name}
            >
              <Input
                name={`virtualSource.tables[${index}].name`}
                value={form.values.virtualSource.tables[index].name}
                onChange={form.handleChange}
                placeholder="请输入名字"
              />
              <FormErrorMessage>请输入名字</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!form.errors.virtualSource?.tables[index]?.clipId}
            >
              <Select
                name={`virtualSource.tables[${index}].clipId`}
                value={form.values.virtualSource.tables[index].clipId}
                onChange={form.handleChange}
                placeholder="请选择数据集"
              >
                {clipIds.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>请选择数据集</FormErrorMessage>
            </FormControl>

            <IconButton
              aria-label="reduce tables filed"
              onClick={() => {
                form.setFieldValue(
                  "virtualSource.tables",
                  form.values.virtualSource.tables.filter(
                    (_: { clipId: string; name: string }, i: number) =>
                      i !== index
                  )
                );

                form.setErrors({
                  virtualSource: {
                    tables: form.errors?.virtualSource?.tables?.filter(
                      (_: any, i: number) => i !== index
                    ),
                  },
                });
              }}
              icon={<MinusIcon />}
            />
          </HStack>
        )
      )}

      <Box w="100%">
        <Button
          onClick={() => {
            form.setFieldValue("virtualSource.tables", [
              ...form.values.virtualSource.tables,
              { name: "", clipId: "" },
            ]);
          }}
        >
          增加配置项
        </Button>
      </Box>
    </>
  );
};
