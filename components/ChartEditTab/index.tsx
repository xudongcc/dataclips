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
} from "./components";

const chartTypeMap = {
  [ChartType.FUNNEL]: "漏斗图",
  [ChartType.METRIC]: "指标图",
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
    if (form.values.type === ChartType.FUNNEL) {
      return {
        groupCol: result.fields,
        valueCol: result.fields,
      } as FunnelChartEditConfig;
    }

    if (form.values.type === ChartType.METRIC) {
      return {
        type: form.values.metricConfig.type,
        // 同比环比需要的列和单值图的列一样
        valueCol: result.fields,
        compareCol: result.fields,
      } as MetricChartEditConfig;
    }

    return undefined;
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
              {[ChartType.FUNNEL, ChartType.METRIC].map((item) => (
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

          {form.values.type === ChartType.METRIC && (
            <MetricChartConfigForm
              form={form}
              editOptionConfig={editOptionConfig as MetricChartEditConfig}
            />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
