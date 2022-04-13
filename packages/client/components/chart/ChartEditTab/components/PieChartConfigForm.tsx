import { FC } from "react";
import { Form, Select } from "antd";

const { Option } = Select;

export interface PieChartEditConfig {
  keys: string[];
  values: string[];
}

interface PieChartConfigFormProps {
  editOptionConfig?: PieChartEditConfig;
}

export const PieChartConfigForm: FC<PieChartConfigFormProps> = ({
  editOptionConfig = { keys: [], values: [] },
}) => {
  return (
    <>
      <Form.Item label="饼图类型" name={["pieConfig", "variant"]}>
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="选择类型"
        >
          <Option value="pie">饼图</Option>
          <Option value="range">环图</Option>
        </Select>
      </Form.Item>

      <Form.Item label="分类" name={["pieConfig", "key"]}>
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="选择分类"
        >
          {editOptionConfig?.keys.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
        label="数值列"
        name={["pieConfig", "value"]}
      >
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="选择数值列"
        >
          {editOptionConfig?.values.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
