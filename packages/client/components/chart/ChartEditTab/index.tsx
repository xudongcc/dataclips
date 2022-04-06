import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { ResultFragment } from "../../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../../types";
import {
  FunnelChartConfigForm,
  MetricChartConfigForm,
  BarChartConfigForm,
  LineChartConfigForm,
  PieChartConfigForm,
} from "./components";
import { FormatFieldForm } from "./components/FormatFieldForm";

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
  form: any;
}

export const ChartEditTab: FC<ChartEditTabProps> = ({
  result = { fields: [], values: [] },
  form,
}) => {
  const router = useRouter();

  const { chartId } = router.query as { chartId: string };

  return (
    <Accordion defaultIndex={[chartId ? 2 : 0]} allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Text fontWeight="bold" flex="1" textAlign="left">
            图表类型
          </Text>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <FormControl isInvalid={!!form.errors.type}>
            <Select
              size="sm"
              placeholder="请选择图表分类"
              name="type"
              onChange={form.handleChange}
              value={form.values.type}
            >
              {[
                ChartType.FUNNEL,
                ChartType.METRIC,
                ChartType.LINE,
                ChartType.BAR,
                ChartType.PIE,
                ChartType.MD,
              ].map((item) => (
                <option value={item} key={item}>
                  {chartTypeMap[item]}
                </option>
              ))}
            </Select>
          </FormControl>
        </AccordionPanel>
      </AccordionItem>

      {form.values.type !== ChartType.MD && (
        <AccordionItem isDisabled={!form.values?.type}>
          <AccordionButton>
            <Text fontWeight="bold" flex="1" textAlign="left">
              标准配置
            </Text>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <FormatFieldForm form={form} />
          </AccordionPanel>
        </AccordionItem>
      )}

      <AccordionItem isDisabled={!form.values?.type}>
        <AccordionButton>
          <Text fontWeight="bold" flex="1" textAlign="left">
            查询分析配置
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {
            [
              {
                type: ChartType.FUNNEL,
                component: (
                  <FunnelChartConfigForm
                    form={form}
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
                    form={form}
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
                    form={form}
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
                    form={form}
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
              {
                type: ChartType.MD,
                component: (
                  <Textarea
                    name="mdConfig.content"
                    value={form.values.mdConfig.content}
                    onChange={form.handleChange}
                  />
                ),
              },
            ].find((item) => item.type === form.values?.type)?.component
          }
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
