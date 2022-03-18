import { Grid, Select, VStack } from "@chakra-ui/react";
import { FC } from "react";

export interface MetricChartEditConfig {
  type: string;
  compareCol: string[];
  valueCol: string[];
}

interface MetricChartConfigForm {
  form: any;
  editOptionConfig?: MetricChartEditConfig;
}

export const MetricChartConfigForm: FC<MetricChartConfigForm> = ({
  form,
  editOptionConfig,
}) => {
  return (
    <VStack mt={4} spacing={4}>
      <Grid
        w="100%"
        gap={4}
        templateColumns={
          form.values.metricConfig.type === "compare" ? `repeat(2, 1fr)` : "1fr"
        }
      >
        <Select
          placeholder="请选择显示值"
          size="sm"
          value={form.values.metricConfig.valueCol}
          onChange={form.handleChange}
          name="metricConfig.valueCol"
        >
          {editOptionConfig?.valueCol.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>

        <Select
          value={form.values.metricConfig.compareCol}
          onChange={form.handleChange}
          placeholder="请选择对比值"
          size="sm"
          name="metricConfig.compareCol"
        >
          {editOptionConfig?.compareCol.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>
      </Grid>
    </VStack>
  );
};
