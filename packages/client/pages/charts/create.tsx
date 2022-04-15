import { useToast, Box, Grid, GridItem } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import {
  ChartEditTab,
  chartTypeToFormFieldMap,
} from "../../components/chart/ChartEditTab";
import { ChartResultPreview } from "../../components/chart/ChartResultPreview";
import ProjectLayout from "../../layouts/ProjectLayout";
import { ChartType } from "../../types";
import {
  CreateChartInput,
  useClipConnectionQuery,
} from "../../generated/graphql";

import { useQueryResult } from "../../hooks/useQueryResult";
import { useRouter } from "next/router";
import { useCreateChartMutation } from "../../hooks/useCreateChartMutation";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { Card } from "../../components/common/Card";
import { Form, Select, Input, Button, Row, Col } from "antd";
import { isEqual, omit } from "lodash";

const { Option } = Select;

const ChartCreate = () => {
  const router = useRouter();
  const toast = useToast();
  const [form] = Form.useForm();

  const [selectClipId, setSelectClipId] = useState("");

  const { data: clipsData } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const [createChart, { loading: createChartLoading }] =
    useCreateChartMutation();

  // 创建图表
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const input = {
        name: values.name,
        type: values.type,
        config: [
          { type: ChartType.FUNNEL, config: values.funnelConfig },
          { type: ChartType.METRIC, config: values.metricConfig },
          { type: ChartType.LINE, config: values.lineConfig },
          { type: ChartType.BAR, config: values.barConfig },
          { type: ChartType.PIE, config: values.pieConfig },
          { type: ChartType.MD, config: values.mdConfig },
        ].find((item) => item.type === values.type).config,
        clipId: values.clipId,
      } as CreateChartInput;

      const result = await createChart({
        variables: {
          input,
        },
      });
      toast({
        description: "创建成功",
        status: "success",
        isClosable: true,
      });
      if (result.data?.createChart.id) {
        router.push(`/charts/${result.data?.createChart.id}/edit`);
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [createChart, form, router, toast]);

  const { data: result } = useQueryResult(selectClipId);

  return (
    <>
      <Head>
        <title>创建 - 图表</title>
      </Head>

      <Page title="创建图表">
        <Form form={form} layout="vertical">
          <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
            <GridItem colSpan={3}>
              <Card>
                <Row gutter={16} justify="space-between">
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      style={{ marginBottom: 0 }}
                      rules={[{ required: true, message: "请输入图表名称" }]}
                    >
                      <Input placeholder="请输入图表名称" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item
                      name="clipId"
                      style={{ marginBottom: 0 }}
                      rules={[{ required: true, message: "请选择数据集" }]}
                    >
                      <Select
                        optionFilterProp="children"
                        showSearch
                        onChange={(clipId) => {
                          setSelectClipId(clipId);

                          form.setFieldsValue({
                            type: undefined,
                          });
                        }}
                        placeholder="请选择数据集"
                      >
                        {clipsData?.clipConnection.edges?.map(
                          ({ node: { id, name } }) => {
                            return (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            );
                          }
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item noStyle>
                      <Button
                        type="primary"
                        loading={createChartLoading}
                        onClick={handleSubmit}
                      >
                        保存
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </GridItem>
            <GridItem colSpan={2}>
              <Box h="500px">
                {result && (
                  <Form.Item
                    shouldUpdate={(prevValues, curValues) => {
                      if (
                        isEqual(
                          omit(prevValues, "name"),
                          omit(curValues, "name")
                        )
                      ) {
                        return false;
                      }
                      return true;
                    }}
                    noStyle
                  >
                    {({ getFieldValue }) => (
                      <Card
                        overflow="hidden"
                        h="full"
                        sx={{
                          ".card-body": {
                            overflowY:
                              getFieldValue("type") === ChartType.MD
                                ? "auto"
                                : undefined,
                          },
                        }}
                      >
                        <ChartResultPreview
                          config={getFieldValue(
                            chartTypeToFormFieldMap[getFieldValue("type")]
                          )}
                          type={getFieldValue("type")}
                          result={result}
                        />
                      </Card>
                    )}
                  </Form.Item>
                )}
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Card>
                <ChartEditTab result={result} />
              </Card>
            </GridItem>
          </Grid>
        </Form>
      </Page>
    </>
  );
};

ChartCreate.layout = ProjectLayout;

export default ChartCreate;
