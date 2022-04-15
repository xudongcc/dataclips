import { FC } from "react";
import { Select, Form, Checkbox } from "antd";

const { Option } = Select;

export interface BarChartEditConfig {
  xCol: string[];
  yCol: string[];
}

interface BarChartConfigFormProps {
  editOptionConfig?: BarChartEditConfig;
}

export const BarChartConfigForm: FC<BarChartConfigFormProps> = ({
  editOptionConfig,
}) => {
  return (
    <>
      <Form.Item label="方向" name={["barConfig", "variant"]}>
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="选择方向"
        >
          <Option value="horizontal">水平</Option>
          <Option value="vertical">垂直</Option>
        </Select>
      </Form.Item>

      <Form.Item label="x 轴字段" name={["barConfig", "xCol"]}>
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="选择 x 轴"
        >
          {editOptionConfig?.xCol.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="y 轴字段" name={["barConfig", "yCol"]}>
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          mode="multiple"
          placeholder="选择 y 轴"
        >
          {editOptionConfig?.xCol.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
        valuePropName="checked"
        name={["barConfig", "isStack"]}
      >
        <Checkbox>显示堆栈</Checkbox>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
        valuePropName="checked"
        name={["barConfig", "reverseOrder"]}
      >
        <Checkbox>反序</Checkbox>
      </Form.Item>
    </>
  );
};
