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
import { Form, Select, Input, Button, Row, Col, notification } from "antd";
import { isEqual, omit } from "lodash";
import { Card } from "../../components/common/Card";
import useContextualSaveBarState from "../../components/common/ContextualSaveBar/useContextualSaveBarState";
import { ContextualSaveBar } from "../../components/common/ContextualSaveBar";

const { Option } = Select;

const ChartCreate = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [, setIsChange] = useContextualSaveBarState();
  const [selectClipId, setSelectClipId] = useState("");

  const { data: clipsData, loading: clipsLoading } = useClipConnectionQuery({
    variables: { first: 100 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
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
        tags: values?.tags,
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

      notification.success({ message: "创建成功", placement: "bottom" });

      setIsChange(false);

      if (result.data?.createChart.id) {
        setTimeout(() => {
          router.push(`/charts/${result.data?.createChart.id}/edit`);
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [createChart, form, router, setIsChange]);

  const { data: result } = useQueryResult(selectClipId);

  return (
    <>
      <Head>
        <title>创建 - 图表</title>
      </Head>

      <Page title="创建图表">
        <Form
          form={form}
          onValuesChange={() => {
            setIsChange(true);
          }}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <Row gutter={[16, 16]} justify="space-between">
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
                        loading={clipsLoading}
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
            </Col>
            <Col span={16}>
              <div style={{ height: 500 }}>
                <Card>
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
                        <ChartResultPreview
                          config={getFieldValue(
                            chartTypeToFormFieldMap[getFieldValue("type")]
                          )}
                          type={getFieldValue("type")}
                          result={result}
                        />
                      )}
                    </Form.Item>
                  )}
                </Card>
              </div>
            </Col>
            <Col span={8}>
              <Card>
                <ChartEditTab result={result} />
              </Card>
            </Col>
          </Row>
        </Form>

        <ContextualSaveBar
          onCancel={() => {
            router.push("/charts");
          }}
          okButtonProps={{
            loading: createChartLoading,
          }}
          onOK={() => {
            handleSubmit();
          }}
        />
      </Page>
    </>
  );
};

ChartCreate.layout = ProjectLayout;

export default ChartCreate;
