import { Checkbox, Grid, Select, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Select as ChakraSelect } from "chakra-react-select";

export interface LineChartEditConfig {
  xCol: string[];
  yCol: string[];
}

interface LineChartConfigFormProps {
  form: any;
  editOptionConfig?: LineChartEditConfig;
}

export const LineChartConfigForm: FC<LineChartConfigFormProps> = ({
  form,
  editOptionConfig,
}) => {
  return (
    <VStack spacing={4}>
      <Grid w="100%" gap={4}>
        <Select
          placeholder="请选择 x 轴"
          size="sm"
          value={form.values.lineConfig.xCol}
          onChange={form.handleChange}
          name="lineConfig.xCol"
        >
          {editOptionConfig?.xCol.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>

        <ChakraSelect
          size="sm"
          name="lineConfig.yCol"
          value={form.values.lineConfig.yCol}
          onChange={(values) => {
            if (!values.length) {
              form.setFieldValue("lineConfig.yCol", []);
            } else {
              form.setFieldValue("lineConfig.yCol", values);
            }
          }}
          placeholder="请选择 y 轴"
          isMulti
          options={editOptionConfig?.yCol.map((value) => ({
            label: value,
            value,
          }))}
        />

        <Checkbox
          name="lineConfig.reverseOrder"
          isChecked={form.values.lineConfig.reverseOrder}
          onChange={form.handleChange}
        >
          反序
        </Checkbox>

        <Checkbox
          name="lineConfig.doubleAxes"
          isChecked={form.values.lineConfig.doubleAxes}
          onChange={form.handleChange}
        >
          双 y 轴
        </Checkbox>
      </Grid>
    </VStack>
  );
};
