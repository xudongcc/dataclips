import { FC } from "react";
import { Select, Row, Col, Form, Space, InputNumber } from "antd";

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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
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

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            style={{ marginBottom: 0 }}
            name={["metricConfig", "thresholdCondition"]}
            label="阈值条件"
          >
            <Select
              optionFilterProp="children"
              showSearch
              allowClear
              placeholder="选择阈值条件"
            >
              {[
                { label: "大于", value: ">" },
                { label: "小于", value: "<" },
                { label: "等于", value: "===" },
                { label: "不等于", value: "!==" },
                { label: "大于等于", value: ">=" },
                { label: "小于等于", value: "<=" },
              ].map((item) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            style={{ marginBottom: 0 }}
            name={["metricConfig", "threshold"]}
            label="阈值"
          >
            <InputNumber style={{ width: "100%" }} placeholder="输入阈值" />
          </Form.Item>
        </Col>
      </Row>
    </Space>
  );
};
