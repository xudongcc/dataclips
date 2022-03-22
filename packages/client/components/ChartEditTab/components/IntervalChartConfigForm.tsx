import { Grid, Select, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Select as ChakraSelect } from "chakra-react-select";

export interface IntervalChartEditConfig {
  xCol: string[];
  yCol: string[];
}

interface IntervalChartConfigFormProps {
  form: any;
  editOptionConfig?: IntervalChartEditConfig;
}

export const IntervalChartConfigForm: FC<IntervalChartConfigFormProps> = ({
  form,
  editOptionConfig,
}) => {
  return (
    <VStack mt={4} spacing={4}>
      <Grid w="100%" gap={4}>
        <Select
          placeholder="请选择 x 轴"
          size="sm"
          value={form.values.intervalConfig.xCol}
          onChange={form.handleChange}
          name="intervalConfig.xCol"
        >
          {editOptionConfig?.xCol.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>

        <ChakraSelect
          size="sm"
          name="intervalConfig.yCol"
          value={form.values.intervalConfig.yCol}
          onChange={(values) => {
            if (!values.length) {
              form.setFieldValue("intervalConfig.yCol", []);
            } else {
              form.setFieldValue("intervalConfig.yCol", values);
            }
          }}
          placeholder="请选择 y 轴"
          isMulti
          options={editOptionConfig?.yCol.map((value) => ({
            label: value,
            value,
          }))}
        />
      </Grid>
    </VStack>
  );
};
