import { FC } from "react";
import { Select, Form, Checkbox } from "antd";

const { Option } = Select;
export interface LineChartEditConfig {
  xCol: string[];
  yCol: string[];
}

interface LineChartConfigFormProps {
  editOptionConfig?: LineChartEditConfig;
}

export const LineChartConfigForm: FC<LineChartConfigFormProps> = ({
  editOptionConfig,
}) => {
  return (
    <>
      <Form.Item label="x 轴字段" name={["lineConfig", "xCol"]}>
        <Select placeholder="选择 x 轴">
          {editOptionConfig?.xCol.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="y 轴字段" name={["lineConfig", "yCol"]}>
        <Select mode="multiple" placeholder="选择 y 轴">
          {editOptionConfig?.yCol.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
        valuePropName="checked"
        name={["lineConfig", "reverseOrder"]}
      >
        <Checkbox>反序</Checkbox>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
        valuePropName="checked"
        name={["lineConfig", "doubleAxes"]}
      >
        <Checkbox>双 y 轴</Checkbox>
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          return (
            <Form.Item
              label="y 轴字段"
              style={{ marginBottom: 0 }}
              name={["lineConfig", "doubleAxesCol"]}
            >
              <Select
                disabled={!getFieldValue(["lineConfig", "doubleAxes"])}
                mode="multiple"
                placeholder="选择 y 轴"
              >
                {editOptionConfig?.yCol.map((value) => (
                  <Option value={value} key={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }}
      </Form.Item>
    </>
  );
};
