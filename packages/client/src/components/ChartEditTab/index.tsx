import {
  Box,
  FormControl,
  Grid,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";

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
        keys: result.fields,
        values: result.fields,
      };
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
              placeholder="请选择图表类型"
              name="type"
              onChange={form.handleChange}
              borderColor={form.errors.type ? "red.500" : undefined}
              color={form.errors.type ? "red.500" : undefined}
              value={form.values.type}
            >
              {[ChartType.FUNNEL].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* 漏斗图表配置选项 */}
          {form.values.type === ChartType.FUNNEL && (
            <Grid mt="4" templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <Text>分组列</Text>
                <Select
                  size="sm"
                  placeholder="请选择分组列"
                  name="funnelConfig.groupCol"
                  onChange={form.handleChange}
                  value={form.values?.funnelConfig.groupCol}
                >
                  {editOptionConfig?.keys.map((key) => (
                    <option value={key} key={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text>数值列</Text>
                <Select
                  size="sm"
                  placeholder="请选择数值列"
                  onChange={form.handleChange}
                  value={form.values?.funnelConfig.valueCol}
                  name="funnelConfig.valueCol"
                >
                  {editOptionConfig?.values.map((value, index) => (
                    <option value={value} key={index}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Box>
            </Grid>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
