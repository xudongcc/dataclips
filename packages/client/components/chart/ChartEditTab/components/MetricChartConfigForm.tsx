import { FC } from "react";
import { Select, Row, Col, Form } from "antd";

const { Option } = Select;

export interface MetricChartEditConfig {
  compareCol: string[];
  valueCol: string[];
}

interface MetricChartConfigFormProps {
  editOptionConfig?: MetricChartEditConfig;
}

export const MetricChartConfigForm: FC<MetricChartConfigFormProps> = ({
  editOptionConfig,
}) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          style={{ marginBottom: 0 }}
          name={["metricConfig", "valueCol"]}
          label="显示值"
        >
          <Select
            optionFilterProp="children"
            showSearch
            allowClear
            placeholder="选择显示值"
          >
            {editOptionConfig?.valueCol.map((value) => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          style={{ marginBottom: 0 }}
          name={["metricConfig", "compareCol"]}
          label="对比值"
        >
          <Select
            optionFilterProp="children"
            showSearch
            allowClear
            placeholder="选择对比值"
          >
            {editOptionConfig?.compareCol.map((value) => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};
