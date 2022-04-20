import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useSourceConnectionQuery } from "../../generated/graphql";
import { useCallback, useState } from "react";
import { SQLEditor } from "../../components/clip/SQLEditor";
import { useCreateClipMutation } from "../../hooks/useCreateClipMutation";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { Row, Col, Form, Input, Select, Button, Space } from "antd";
import { Card } from "../../components/common/Card";

const { Option } = Select;

const ClipCreate = () => {
  const toast = useToast();
  const router = useRouter();
  const [form] = Form.useForm();

  const [sqlValue, setSqlValue] = useState("");

  const [createClip, { loading: createClipLoading }] = useCreateClipMutation();

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 50 } });

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const { data } = await createClip({
        variables: {
          input: {
            ...values,
            sql: sqlValue,
          },
        },
      });
      toast({
        title: "创建成功",
        status: "success",
      });

      router.push(`/clips/${data?.createClip.id}/edit`);
    } catch (err) {
      //
    }
  }, [createClip, form, router, sqlValue, toast]);

  return (
    <>
      <Head>
        <title>创建 - 数据集</title>
      </Head>

      <Page title="创建数据集">
        <Form form={form}>
          <Card>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Row gutter={[16, 16]} justify="space-between">
                <Col flex={0.5}>
                  <Form.Item
                    name="name"
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: "请输入名称" }]}
                  >
                    <Input placeholder="请输入名称"></Input>
                  </Form.Item>
                </Col>
                <Col flex={1}>
                  <Form.Item
                    name="sourceId"
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: "请选择数据源" }]}
                  >
                    <Select
                      optionFilterProp="children"
                      showSearch
                      placeholder="请选择数据源"
                    >
                      {sourceConnection?.edges?.map(
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

                <Col flex={1}>
                  <Form.Item style={{ marginBottom: 0 }} name="tags">
                    <Select allowClear mode="tags" placeholder="使用标签" />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item noStyle>
                    <Button
                      type="primary"
                      loading={createClipLoading}
                      onClick={handleSubmit}
                    >
                      保存
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              <div
                style={{
                  border: "1px solid #ececec",
                  overflow: "hidden",
                  borderRadius: "2px",
                }}
              >
                <SQLEditor
                  value={sqlValue}
                  onChange={(value) => {
                    setSqlValue(value);
                  }}
                />
              </div>
            </Space>
          </Card>
        </Form>
      </Page>
    </>
  );
};

ClipCreate.layout = ProjectLayout;

export default ClipCreate;
