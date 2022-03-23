import { Grid, Select, VStack } from "@chakra-ui/react";
import { FC } from "react";

export interface PieChartEditConfig {
  variant: string;
  keys: string[];
  values: string[];
}

interface PieChartConfigFormProps {
  form: any;
  editOptionConfig?: PieChartEditConfig;
}

export const PieChartConfigForm: FC<PieChartConfigFormProps> = ({
  form,
  editOptionConfig = { keys: [], values: [] },
}) => {
  return (
    <VStack mt={4} spacing={4}>
      <Grid w="100%" gap={4}>
        <Select
          placeholder="请选择类型"
          size="sm"
          value={form.values.pieConfig.variant}
          onChange={form.handleChange}
          name="pieConfig.variant"
        >
          <option value="pie">饼图</option>

          <option value="range">环图</option>
        </Select>

        <Select
          placeholder="请选择分类"
          size="sm"
          value={form.values.pieConfig.key}
          onChange={form.handleChange}
          name="pieConfig.key"
        >
          {editOptionConfig?.keys.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>

        <Select
          placeholder="请选择数值列"
          size="sm"
          value={form.values.pieConfig.value}
          onChange={form.handleChange}
          name="pieConfig.value"
        >
          {editOptionConfig?.values.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>
      </Grid>
    </VStack>
  );
};
