import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { DataSourceForm } from "../../components/source/DataSourceForm";
import { VirtualSourceForm } from "../../components/source/VirtualSourceForm";
import { useCreateVirtualSourceMutation } from "../../hooks/useCreateVirtualSourceMutation";
import { useCreateDatabaseSourceMutation } from "../../hooks/useCreateDatabaseSourceMutation";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { useCheckConnectDatabaseSourceMutation } from "../../generated/graphql";
import { Form, Select, Button, Steps, Space, Row } from "antd";
import { Card } from "../../components/common/Card";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Step } = Steps;

const steps = ["数据源", "配置"];

const SourceCreate = () => {
  const toast = useToast();
  const router = useRouter();
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [currentSourceType, setCurrentSourceType] = useState("");

  const [createDataBaseSource, { loading: createDataBaseSourceLoading }] =
    useCreateDatabaseSourceMutation();
  const [createVirtualSource, { loading: createVirtualSourceLoading }] =
    useCreateVirtualSourceMutation();

  const [
    checkConnectDatabaseSource,
    {
      loading: checkConnectDatabaseSourceLoading,
      data: checkConnectDatabaseSourceData,
      error: checkConnectDatabaseSourceError,
    },
  ] = useCheckConnectDatabaseSourceMutation();

  const getSourceForm = useCallback(
    (type: "DatabaseSource" | "VirtualSource") => {
      if (type === "DatabaseSource") {
        return <DataSourceForm />;
      } else {
        return <VirtualSourceForm />;
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (currentSourceType === "DatabaseSource") {
        await createDataBaseSource({
          variables: {
            input: {
              ...values.dataSource,
            },
          },
        });
      }

      if (currentSourceType === "VirtualSource") {
        await createVirtualSource({
          variables: {
            input: {
              ...values.virtualSource,
              tables: values?.virtualSource?.tables || [],
            },
          },
        });
      }

      toast({
        description: "创建成功",
        status: "success",
        isClosable: true,
      });

      router.push(`/sources`);
    } catch (err) {
      console.log("err", err);
    }
  }, [
    createDataBaseSource,
    createVirtualSource,
    currentSourceType,
    form,
    router,
    toast,
  ]);

  return (
    <>
      <Head>
        <title>创建 - 数据源</title>
      </Head>

      <Page
        title="创建数据源"
        primaryAction={
          current === 1 && {
            text: "创建",
            onClick: () => handleSubmit(),
            loading: createDataBaseSourceLoading || createVirtualSourceLoading,
          }
        }
        secondaryActions={
          current === 1 &&
          currentSourceType === "DatabaseSource" && [
            {
              text: "测试连接",
              danger: !!checkConnectDatabaseSourceError,
              loading: checkConnectDatabaseSourceLoading,
              icon: checkConnectDatabaseSourceData?.checkConnectDatabaseSource ? (
                <CheckOutlined style={{ color: "#53c31b" }} />
              ) : checkConnectDatabaseSourceError ? (
                <CloseOutlined style={{ color: "#ff4d4e" }} />
              ) : undefined,
              onClick: async () => {
                try {
                  const values = await form.validateFields();

                  await checkConnectDatabaseSource({
                    variables: {
                      input: {
                        ...values.dataSource,
                      },
                    },
                  });
                } catch (err) {
                  console.log("err", err);
                }
              },
            },
          ]
        }
      >
        <Form form={form}>
          <Card>
            <Steps
              labelPlacement="vertical"
              onChange={(c) => {
                setCurrent(c);
              }}
              current={current}
            >
              {steps.map((key) => (
                <Step disabled={!currentSourceType} key={key} title={key} />
              ))}
            </Steps>
            <div>
              {current === 0 ? (
                <Space
                  direction="vertical"
                  style={{ display: "flex", marginTop: 16 }}
                >
                  <Form.Item
                    name="type"
                    rules={[{ required: true, message: "请选择数据源" }]}
                  >
                    <Select
                      optionFilterProp="children"
                      showSearch
                      placeholder="请选择数据源"
                      onChange={(sourceType) => {
                        setCurrentSourceType(sourceType);
                      }}
                    >
                      <Option value="DatabaseSource">DatabaseSource</Option>
                      <Option value="VirtualSource">VirtualSource</Option>
                    </Select>
                  </Form.Item>

                  <Row justify="center">
                    <Button
                      type="primary"
                      onClick={async () => {
                        try {
                          const values = await form.validateFields();

                          if (values?.type) {
                            setCurrent(1);
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      下一步
                    </Button>
                  </Row>
                </Space>
              ) : (
                <div style={{ marginTop: 16 }}>
                  {getSourceForm(form.getFieldValue("type"))}
                </div>
              )}
            </div>
          </Card>
        </Form>
      </Page>
    </>
  );
};

SourceCreate.layout = ProjectLayout;

export default SourceCreate;
