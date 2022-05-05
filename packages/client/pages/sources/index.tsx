import ProjectLayout from "../../layouts/ProjectLayout";
import { useToast, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  DatabaseSource,
  UpdateDatabaseSourceInput,
  useSourceLazyQuery,
  useUpdateDatabaseSourceMutation,
  useUpdateVirtualSourceMutation,
  VirtualSource,
  useSourceConnectionLazyQuery,
  useDeleteSourceMutation,
} from "../../generated/graphql";
import { omit } from "lodash";
import { useCallback } from "react";
import { DataSourceForm } from "../../components/source/DataSourceForm";
import { VirtualSourceForm } from "../../components/source/VirtualSourceForm";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { Modal } from "../../components/common/Modal";
import { Form } from "antd";
import {
  FilterType,
  GraphQLTable,
  GraphQLTableColumnType,
} from "../../components/common/GraphQLTable";
import { ValueType } from "../../components/common/SimpleTable";

const SourceList = () => {
  const router = useRouter();
  const toast = useToast();
  const [form] = Form.useForm();

  const [getSources, { data, loading, refetch }] = useSourceConnectionLazyQuery(
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
    }
  );

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [selectedSource, setSelectedSource] = useState<{
    type: "DatabaseSource" | "VirtualSource";
    id: string;
  }>();

  const [getSource, { loading: sourceLoading }] = useSourceLazyQuery();

  const [deleteSource] = useDeleteSourceMutation();

  const [updateDatabaseSource, { loading: updateDatabaseSourceLoading }] =
    useUpdateDatabaseSourceMutation();

  const [updateVirtualSource, { loading: updateVirtualSourceLoading }] =
    useUpdateVirtualSourceMutation();

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (selectedSource?.id) {
        if (selectedSource?.type === "DatabaseSource") {
          const input: Record<string, any> = omit(values.dataSource, [
            "password",
          ]);

          if (values.dataSource.password) {
            input.password = values.dataSource.password;
          }

          await updateDatabaseSource({
            variables: {
              id: selectedSource.id,
              input: {
                ...(input as UpdateDatabaseSourceInput),
              },
            },
          });
        }

        if (selectedSource?.type === "VirtualSource") {
          await updateVirtualSource({
            variables: {
              id: selectedSource.id,
              input: values.virtualSource,
            },
          });
        }

        setEditModalVisible(false);
        setSelectedSource(undefined);

        form.resetFields();
        toast({
          description: "更新成功",
          status: "success",
          isClosable: true,
        });

        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    form,
    refetch,
    selectedSource?.id,
    selectedSource?.type,
    toast,
    updateDatabaseSource,
    updateVirtualSource,
  ]);

  const columns: GraphQLTableColumnType<any>[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        return (
          <Link
            onClick={async () => {
              setSelectedSource({ id: record?.id, type: record?.typename });
              setEditModalVisible(true);

              const result = await getSource({ variables: { id: record?.id } });

              const source = result.data?.source as
                | DatabaseSource
                | VirtualSource
                | undefined;

              try {
                if (record?.typename === "DatabaseSource") {
                  if (source) {
                    form.setFieldsValue({
                      dataSource: {
                        name: (source as DatabaseSource).name,
                        host: (source as DatabaseSource).host,
                        port: (source as DatabaseSource).port!,
                        database: (source as DatabaseSource).database!,
                        username: (source as DatabaseSource).username,
                        password: "",
                        type: (source as DatabaseSource).type,
                        tags: (source as DatabaseSource).tags,
                        sshEnabled: (source as DatabaseSource).sshEnabled,
                        sshHost: (source as DatabaseSource).sshHost || "",
                        sshPort:
                          (source as DatabaseSource).sshPort || undefined,
                        sshUsername:
                          (source as DatabaseSource).sshUsername || "",
                      },
                    });
                  }
                }

                if (record?.typename === "VirtualSource") {
                  if (source) {
                    form.setFieldsValue({
                      virtualSource: {
                        name: (source as VirtualSource).name,
                        tags: (source as VirtualSource).tags,
                        tables: (source as VirtualSource).tables.map(
                          (table) => ({
                            name: table.name,
                            clipId: table.clip.id,
                            id: table.id,
                          })
                        ),
                      },
                    });
                  }
                }
              } catch (err) {
                console.log("err", err);
              }
            }}
            color="blue.500"
          >
            {name}
          </Link>
        );
      },
    },
    {
      title: "类型",
      align: "center",
      dataIndex: "typename",
      key: "typename",
      render: (typename) => {
        if (typename === "VirtualSource") {
          return "虚拟数据源";
        }

        if (typename === "DatabaseSource") {
          return "真实数据源";
        }
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      // filterType: FilterType.TAG,
      key: "tags",
      valueType: {
        type: ValueType.TAG,
        onClick: () => {},
      },
      width: 200,
    },
    {
      title: "最后更新时间",
      sorter: true,
      align: "center",
      dataIndex: "updatedAt",
      key: "updatedAt",
      valueType: ValueType.DATE_TIME,
    },
    {
      title: "操作",
      dataIndex: "operation",
      align: "center",
      key: "operation",
      render: (_, record) => {
        return (
          <Link
            onClick={() => {
              const modal = Modal.confirm({
                title: "删除数据源",
                content: `确定删除名称为 ${record?.name} 的数据源？`,
                okText: "确认",
                okButtonProps: {
                  danger: true,
                },
                cancelText: "取消",
                onOk: async () => {
                  try {
                    modal.update({ okButtonProps: { loading: true } });

                    await deleteSource({ variables: { id: record?.id } });

                    modal.update({ okButtonProps: { loading: false } });

                    toast({
                      description: "删除成功",
                      status: "success",
                      isClosable: true,
                    });

                    refetch();
                  } catch (err) {
                    console.error(err);
                  }
                },
              });
            }}
            color="red.500"
          >
            删除
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>数据源</title>
      </Head>

      <Page
        title="数据源"
        primaryAction={{
          text: "创建数据源",
          onClick: () => {
            router.push("/sources/create");
          },
        }}
      >
        <GraphQLTable
          id="clips"
          pageSize={100}
          // pageInfo={data?.clipConnection?.pageInfo}
          options={false}
          onVariablesChange={(variables) => {
            getSources({ variables });
          }}
          columns={columns}
          dataSource={data?.sourceConnection?.edges?.map((item) => item?.node)}
          loading={loading}
        />

        {/* 编辑 modal */}
        <Modal
          visible={editModalVisible}
          title="编辑数据源"
          okButtonProps={{
            loading:
              updateDatabaseSourceLoading ||
              sourceLoading ||
              updateVirtualSourceLoading,
          }}
          onCancel={() => {
            setEditModalVisible(false);
            form.resetFields();
          }}
          onOk={handleSubmit}
        >
          <Form form={form}>
            {selectedSource?.type === "DatabaseSource" && (
              <DataSourceForm
                passwordHasRequired={false}
                sshPasswordHasRequired={false}
              />
            )}

            {selectedSource?.type === "VirtualSource" && <VirtualSourceForm />}
          </Form>
        </Modal>
      </Page>
    </>
  );
};

SourceList.layout = ProjectLayout;

export default SourceList;
