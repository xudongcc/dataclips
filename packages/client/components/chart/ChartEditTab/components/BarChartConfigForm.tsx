import { Checkbox, Grid, Select, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Select as ChakraSelect } from "chakra-react-select";

export interface BarChartEditConfig {
  xCol: string[];
  yCol: string[];
}

interface BarChartConfigFormProps {
  form: any;
  editOptionConfig?: BarChartEditConfig;
}

export const BarChartConfigForm: FC<BarChartConfigFormProps> = ({
  form,
  editOptionConfig,
}) => {
  return (
    <VStack spacing={4}>
      <Grid w="100%" gap={4}>
        <Select
          placeholder="请选择方向"
          size="sm"
          value={form.values.barConfig.variant}
          onChange={form.handleChange}
          name="barConfig.variant"
        >
          <option value="horizontal">水平</option>
          <option value="vertical">垂直</option>
        </Select>

        <Select
          placeholder="请选择 x 轴"
          size="sm"
          value={form.values.barConfig.xCol}
          onChange={form.handleChange}
          name="barConfig.xCol"
        >
          {editOptionConfig?.xCol.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>

        <ChakraSelect
          size="sm"
          name="barConfig.yCol"
          value={form.values.barConfig.yCol}
          onChange={(values) => {
            if (!values.length) {
              form.setFieldValue("barConfig.yCol", []);
            } else {
              form.setFieldValue("barConfig.yCol", values);
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
          name="barConfig.isStack"
          isChecked={form.values.barConfig.isStack}
          onChange={form.handleChange}
        >
          显示堆栈
        </Checkbox>

        <Checkbox
          name="barConfig.reverseOrder"
          isChecked={form.values.barConfig.reverseOrder}
          onChange={form.handleChange}
        >
          反序
        </Checkbox>
      </Grid>
    </VStack>
  );
};
