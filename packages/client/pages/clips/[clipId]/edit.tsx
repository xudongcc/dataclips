import ProjectLayout from "../../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  useUpdateClipMutation,
  useClipQuery,
  useSourceConnectionQuery,
} from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { ResultPreview } from "../../../components/clip/ResultPreview";
import { SQLEditor } from "../../../components/clip/SQLEditor";
import { Page } from "../../../components/common/Page";
import Head from "next/head";
import { Row, Col, Form, Select, Input, Space, Button } from "antd";
import { Card } from "../../../components/common/Card";

const { Option } = Select;

const ClipEdit = () => {
  const toast = useToast();
  const router = useRouter();
  const [form] = Form.useForm();
  const { clipId } = router.query as { clipId: string };

  const [sqlValue, setSqlValue] = useState("");

  const [updateClip, { loading: updateClipLoading }] = useUpdateClipMutation();

  const { data: { clip } = {} } = useClipQuery({
    variables: { id: clipId! },
    skip: !clipId,
  });

  const { data: { sourceConnection } = {}, loading: isSourcesLoading } =
    useSourceConnectionQuery({ variables: { first: 20 } });

  const { data: result } = useQueryResult(clipId);

  const handleSubmit = useCallback(async () => {
    try {
      if (clipId) {
        const values = await form.validateFields();

        await updateClip({
          variables: { id: clipId, input: { ...values, sql: sqlValue } },
        });

        toast({
          title: "保存成功",
          status: "success",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [clipId, form, sqlValue, toast, updateClip]);

  useEffect(() => {
    if (clip?.sql) {
      setSqlValue(clip.sql);
    }
  }, [clip]);

  useEffect(() => {
    if (clip) {
      form.setFieldsValue({
        name: clip?.name,
        sourceId: clip?.sourceId,
        tags: clip?.tags,
      });
    }
  }, [clip, form]);

  return (
    <>
      <Head>
        <title>{result?.name} - 编辑 - 数据集</title>
      </Head>

      <Page title={result?.name}>
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
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
                        loading={updateClipLoading}
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

          <div style={{ flex: 1 }}>
            {result && !result?.message ? (
              <ResultPreview token={clip?.token!} result={result} />
            ) : null}
          </div>
        </Space>
      </Page>
    </>
  );
};

ClipEdit.layout = ProjectLayout;

export default ClipEdit;
