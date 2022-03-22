import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  Grid,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { useClipConnectionQuery } from "../../generated/graphql";

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
          <Grid
            key={index}
            gap={4}
            templateColumns={
              form.values.virtualSource.tables.length > 1
                ? "repeat(2, 0.8fr) repeat(2, 0.2fr)"
                : "repeat(2, 0.8fr) 0.2fr"
            }
            w="100%"
          >
            <FormControl
              isInvalid={!!form.errors.virtualSource?.tables[index]?.name}
            >
              <Input
                name={`virtualSource.tables[${index}].name`}
                value={form.values.virtualSource.tables[index].name}
                onChange={form.handleChange}
                placeholder="请输入名字"
              ></Input>
              <FormErrorMessage>请输入名字</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!form.errors.virtualSource?.tables[index]?.clipId}
            >
              <Select
                name={`virtualSource.tables[${index}].clipId`}
                value={form.values.virtualSource.tables[index].clipId}
                onChange={form.handleChange}
                placeholder="请选择 clipId"
              >
                {clipIds.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>请选择 clipId</FormErrorMessage>
            </FormControl>

            <IconButton
              aria-label="add tables filed"
              onClick={() => {
                form.setFieldValue("virtualSource.tables", [
                  ...form.values.virtualSource.tables,
                  { name: "", clipId: "" },
                ]);
              }}
              icon={<AddIcon />}
            />

            {form.values.virtualSource.tables.length > 1 && (
              <IconButton
                aria-label="reduce tables filed"
                onClick={() => {
                  form.setFieldValue(
                    "virtualSource.tables",
                    form.values.virtualSource.tables.filter(
                      (item: { clipId: string; name: string }, i: number) =>
                        i !== index
                    )
                  );
                }}
                icon={<MinusIcon />}
              />
            )}
          </Grid>
        )
      )}
    </>
  );
};
