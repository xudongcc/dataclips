import {
  FormControl,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";
import {
  FunnelChartConfigForm,
  FunnelChartEditConfig,
  MetricChartConfigForm,
  MetricChartEditConfig,
  IntervalChartConfigForm,
  IntervalChartEditConfig,
  LineChartEditConfig,
  LineChartConfigForm,
} from "./components";

export const chartTypeMap = {
  [ChartType.FUNNEL]: "漏斗图",
  [ChartType.METRIC]: "指标图",
  [ChartType.LINE]: "折线图",
  [ChartType.INTERVAL]: "柱状图",
};

interface ChartEditTabProps extends Partial<ChartServerConfig> {
  result?: ResultFragment;
  form: any;
}

export const ChartEditTab: FC<ChartEditTabProps> = ({
  result = { fields: [], values: [] },
  form,
}) => {
  // 根据不同图表类型配置不同的选项
  const editOptionConfig = useMemo(() => {
    return (
      [
        {
          type: ChartType.FUNNEL,
          config: {
            groupCol: result.fields,
            valueCol: result.fields,
          },
        },
        {
          type: ChartType.METRIC,
          config: {
            valueCol: result.fields,
            compareCol: result.fields,
          },
        },
        {
          type: ChartType.LINE,
          config: { xCol: result.fields, yCol: result.fields },
        },
        {
          type: ChartType.INTERVAL,
          config: { xCol: result.fields, yCol: result.fields },
        },
      ].find((item) => item.type === form.values.type)?.config || undefined
    );
  }, [form, result]);

  return (
    <Tabs p="2">
      <TabList>
        <Tab>属性配置</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <FormControl isInvalid={!!form.errors.type}>
            <Select
              size="sm"
              placeholder="请选择图表分类"
              name="type"
              onChange={form.handleChange}
              borderColor={form.errors.type ? "red.500" : undefined}
              color={form.errors.type ? "red.500" : undefined}
              value={form.values.type}
            >
              {[
                ChartType.FUNNEL,
                ChartType.METRIC,
                ChartType.LINE,
                ChartType.INTERVAL,
              ].map((item) => (
                <option value={item} key={item}>
                  {chartTypeMap[item]}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* 漏斗图表配置选项 */}
          {form.values.type === ChartType.FUNNEL && (
            <FunnelChartConfigForm
              form={form}
              editOptionConfig={editOptionConfig as FunnelChartEditConfig}
            />
          )}

          {/* 单值图配置选项 */}
          {form.values.type === ChartType.METRIC && (
            <MetricChartConfigForm
              form={form}
              editOptionConfig={editOptionConfig as MetricChartEditConfig}
            />
          )}

          {/* 折线图配置选项 */}
          {form.values.type === ChartType.LINE && (
            <LineChartConfigForm
              form={form}
              editOptionConfig={editOptionConfig as LineChartEditConfig}
            />
          )}

          {/* 柱状图配置选项 */}
          {form.values.type === ChartType.INTERVAL && (
            <IntervalChartConfigForm
              form={form}
              editOptionConfig={editOptionConfig as IntervalChartEditConfig}
            />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
