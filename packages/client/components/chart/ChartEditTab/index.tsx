import { Form, Select, Divider } from "antd";
import moment from "antd/node_modules/moment";
import { FC, useState } from "react";
import numeral from "numeral";
import { ResultFragment } from "../../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../../types";
import { formatSecondToStr } from "../../../utils/formatSecondToStr";
import {
  FunnelChartConfigForm,
  MetricChartConfigForm,
  BarChartConfigForm,
  LineChartConfigForm,
  PieChartConfigForm,
} from "./components";
import { AutoComplete } from "../../common/AutoComplete";

export const chartTypeToFormFieldMap = {
  [ChartType.FUNNEL]: "funnelConfig",
  [ChartType.LINE]: "lineConfig",
  [ChartType.BAR]: "barConfig",
  [ChartType.METRIC]: "metricConfig",
  [ChartType.PIE]: "pieConfig",
};

enum FormatType {
  NUMERAL = "NUMERAL",
  MOMENT = "MOMENT",
  DURATION = "DURATION",
}

const options = [
  { label: "无格式化", value: "" },
  { label: "10,000", value: "0,0", type: FormatType.NUMERAL },
  { label: "B,KB,MB...", value: "0b", type: FormatType.NUMERAL },
  { label: "B,KiB,MiB...", value: "0ib", type: FormatType.NUMERAL },
  { label: "秒", value: "seconds", type: FormatType.DURATION },
  { label: "百分比", value: "0%", type: FormatType.NUMERAL },
  { label: "百分比（保留两位小数）", value: "0.00%", type: FormatType.NUMERAL },
  { label: "年-月-日", value: "YYYY-MM-DD", type: FormatType.MOMENT },
  {
    label: "年-月-日 时:分:秒",
    value: "YYYY-MM-DD HH:mm:ss",
    type: FormatType.MOMENT,
  },
];

const momentFormatList = options
  .filter((item) => item.type === FormatType.MOMENT)
  .map((item) => item.value);

export const getFormatValue = (value: any, format?: string) => {
  if (format) {
    if (momentFormatList.includes(format)) {
      return moment(value).format(format) ?? value;
    }

    if (format === "seconds") {
      return formatSecondToStr(value);
    }

    return numeral(value).format(format) ?? value;
  }

  return numeral(value).value() ?? value;
};

const { Option } = Select;

export const chartTypeMap = {
  [ChartType.FUNNEL]: "漏斗图",
  [ChartType.METRIC]: "指标图",
  [ChartType.LINE]: "折线图",
  [ChartType.BAR]: "柱状图",
  [ChartType.PIE]: "饼图",
  [ChartType.MD]: "Markdown",
};

interface ChartEditTabProps extends Partial<ChartServerConfig> {
  result?: ResultFragment;
}

export const ChartEditTab: FC<ChartEditTabProps> = ({
  result = { fields: [], values: [] },
}) => {
  const [currentChartType, setCurrentChartType] = useState("");

  return (
    <div>
      <Divider style={{ marginTop: 0 }} orientation="left">
        图表类型
      </Divider>

      <Form.Item
        name="type"
        style={{ marginBottom: 0 }}
        rules={[{ required: true, message: "请选择图表类型" }]}
      >
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择图表类型"
          onChange={(chartType) => {
            setCurrentChartType(chartType);
          }}
        >
          {[
            ChartType.FUNNEL,
            ChartType.METRIC,
            ChartType.LINE,
            ChartType.BAR,
            ChartType.PIE,
          ].map((item) => (
            <Option value={item} key={item}>
              {chartTypeMap[item]}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">标准配置</Divider>

      <Form.Item
        name={[chartTypeToFormFieldMap[currentChartType], "format"]}
        style={{ marginBottom: currentChartType ? undefined : 0 }}
      >
        <AutoComplete
          allowClear
          options={options}
          placeholder="选择格式化方式"
          disabled={!currentChartType}
        />
      </Form.Item>

      {currentChartType && (
        <Divider style={{ marginTop: 0 }} orientation="left">
          查询分析配置
        </Divider>
      )}
      {
        [
          {
            type: ChartType.FUNNEL,
            component: (
              <FunnelChartConfigForm
                editOptionConfig={{
                  groupCol: result.fields,
                  valueCol: result.fields,
                }}
              />
            ),
          },
          {
            type: ChartType.METRIC,
            component: (
              <MetricChartConfigForm
                editOptionConfig={{
                  valueCol: result.fields,
                  compareCol: result.fields,
                }}
              />
            ),
          },
          {
            type: ChartType.LINE,
            component: (
              <LineChartConfigForm
                editOptionConfig={{
                  xCol: result.fields,
                  yCol: result.fields,
                }}
              />
            ),
          },
          {
            type: ChartType.BAR,
            component: (
              <BarChartConfigForm
                editOptionConfig={{
                  xCol: result.fields,
                  yCol: result.fields,
                }}
              />
            ),
          },
          {
            type: ChartType.PIE,
            component: (
              <PieChartConfigForm
                editOptionConfig={{
                  keys: result.fields,
                  values: result.fields,
                }}
              />
            ),
          },
        ].find((item) => item.type === currentChartType)?.component
      }

      {/* 标签 */}
      <Divider orientation="left">标签</Divider>
      <Form.Item style={{ marginBottom: 0 }} name="tags">
        <Select allowClear mode="tags" placeholder="查找或创建标签" />
      </Form.Item>

      {/* 只为了监听 type 是否为空，空的话隐藏查询分析配置 */}
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const currentType = getFieldValue("type");

          if (!currentType) {
            setCurrentChartType("");
          } else {
            setCurrentChartType(currentType);
          }
        }}
      </Form.Item>
    </div>
  );
};
