import { Box, Grid, Select, Text } from "@chakra-ui/react";
import { FC } from "react";

export interface FunnelChartEditConfig {
  groupCol: string[];
  valueCol: string[];
}

interface FunnelChartConfigFormProps {
  form: any;
  editOptionConfig?: FunnelChartEditConfig;
}

export const FunnelChartConfigForm: FC<FunnelChartConfigFormProps> = ({
  form,
  editOptionConfig,
}) => {
  return (
    <Grid mt="4" templateColumns="repeat(2, 1fr)" gap={4}>
      <Box>
        <Text>分组列</Text>
        <Select
          size="sm"
          placeholder="请选择分组列"
          name="funnelConfig.groupCol"
          onChange={form.handleChange}
          value={form.values?.funnelConfig.groupCol}
        >
          {editOptionConfig?.groupCol.map((key) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text>数值列</Text>
        <Select
          size="sm"
          placeholder="请选择数值列"
          onChange={form.handleChange}
          value={form.values?.funnelConfig.valueCol}
          name="funnelConfig.valueCol"
        >
          {editOptionConfig?.valueCol.map((value, index) => (
            <option value={value} key={index}>
              {value}
            </option>
          ))}
        </Select>
      </Box>
    </Grid>
  );
};
