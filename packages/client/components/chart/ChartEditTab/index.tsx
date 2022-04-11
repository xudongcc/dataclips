import { Form, FormInstance, Select, Divider } from "antd";
import moment from "antd/node_modules/moment";
import { FC, useEffect, useState } from "react";
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
  form: FormInstance<any>;
}

export const ChartEditTab: FC<ChartEditTabProps> = ({
  result = { fields: [], values: [] },
  form,
}) => {
  const [currentChartType, setCurrentChartType] = useState("");

  useEffect(() => {
    const type = form.getFieldValue("type");
    if (type) {
      setCurrentChartType(type);
    }
  }, [form]);

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
            ChartType.MD,
          ].map((item) => (
            <Option value={item} key={item}>
              {chartTypeMap[item]}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">标准配置</Divider>
      <Form.Item
        style={{ marginBottom: currentChartType ? undefined : 0 }}
        name={[chartTypeToFormFieldMap[currentChartType], "format"]}
      >
        <Select
          placeholder="选择格式化方式"
          disabled={!currentChartType}
          style={{ width: "100%" }}
        >
          {options?.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
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
                form={form}
                editOptionConfig={{
                  keys: result.fields,
                  values: result.fields,
                }}
              />
            ),
          },
          // {
          //   type: ChartType.MD,
          //   component: (
          //     <Textarea
          //       name="mdConfig.content"
          //       value={form.values.mdConfig.content}
          //       onChange={form.handleChange}
          //       placeholder="请输入 markdown 语法"
          //     />
          //   ),
          // },
        ].find((item) => item.type === currentChartType)?.component
      }

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          if (!getFieldValue("type")) {
            setCurrentChartType("");
          }
        }}
      </Form.Item>
    </div>
  );
};
