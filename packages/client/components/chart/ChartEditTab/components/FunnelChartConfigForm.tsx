import { FC } from "react";
import { Row, Col, Form, Select } from "antd";

const { Option } = Select;
export interface FunnelChartEditConfig {
  groupCol: string[];
  valueCol: string[];
}

interface FunnelChartConfigFormProps {
  editOptionConfig?: FunnelChartEditConfig;
}

export const FunnelChartConfigForm: FC<FunnelChartConfigFormProps> = ({
  editOptionConfig,
}) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          style={{ marginBottom: 0 }}
          label="分组列"
          name={["funnelConfig", "groupCol"]}
        >
          <Select allowClear placeholder="选择分组列">
            {editOptionConfig?.groupCol.map((key) => (
              <Option value={key} key={key}>
                {key}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          style={{ marginBottom: 0 }}
          label="数值列"
          name={["funnelConfig", "valueCol"]}
        >
          <Select allowClear placeholder="选择数值列">
            {editOptionConfig?.valueCol.map((key) => (
              <Option value={key} key={key}>
                {key}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};
