import ProjectLayout from "../../layouts/ProjectLayout";
import { useToast, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  DatabaseSource,
  UpdateDatabaseSourceInput,
  useSourceConnectionQuery,
  useSourceLazyQuery,
  useUpdateDatabaseSourceMutation,
  useUpdateVirtualSourceMutation,
  VirtualSource,
} from "../../generated/graphql";
import { useDeleteSourceMutation } from "../../hooks/useDeleteSourceMutation";
import { omit } from "lodash";
import { useCallback, useMemo } from "react";
import { Column, TableOptions } from "react-table";
import moment from "moment";
import { DataSourceForm } from "../../components/source/DataSourceForm";
import { VirtualSourceForm } from "../../components/source/VirtualSourceForm";
import { Table } from "../../components/common/Table";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { Modal } from "../../components/common/Modal";
import { Form } from "antd";

const SourceList = () => {
  const router = useRouter();
  const toast = useToast();
  const [form] = Form.useForm();

  const { data, loading } = useSourceConnectionQuery({
    variables: { first: 100 },
  });

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [selectedSource, setSelectedSource] = useState<{
    type: "DatabaseSource" | "VirtualSource";
    id: string;
  }>();

  const [getSource, { data: sourceData, loading: sourceLoading }] =
    useSourceLazyQuery();

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
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    form,
    selectedSource?.id,
    selectedSource?.type,
    toast,
    updateDatabaseSource,
    updateVirtualSource,
  ]);

  const tableProps = useMemo<TableOptions<any>>(() => {
    const columns: Column<any>[] = [
      {
        Header: "name",
        accessor: "name",
        Cell: ({
          row: {
            original: { id, name, typename },
          },
        }) => {
          return (
            <Link
              onClick={async () => {
                setSelectedSource({ id, type: typename });
                setEditModalVisible(true);

                const result = await getSource({ variables: { id } });

                const source = result.data?.source as
                  | DatabaseSource
                  | VirtualSource
                  | undefined;

                try {
                  if (typename === "DatabaseSource") {
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

                  if (typename === "VirtualSource") {
                    if (source) {
                      form.setFieldsValue({
                        virtualSource: {
                          name: (source as VirtualSource).name,
                          tables: (source as VirtualSource).tables.map(
                            (table) => ({
                              name: table.name,
                              clipId: table.clipId,
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
        Header: "updatedAt",
        accessor: "updatedAt",
        Cell: ({
          row: {
            values: { updatedAt },
          },
        }) => {
          return moment(updatedAt).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      {
        Header: "operation",
        accessor: "operation",
        Cell: ({
          row: {
            original: { id, typename },
          },
        }) => {
          return (
            <Link
              onClick={() => {
                const modal = Modal.confirm({
                  title: "删除数据源",
                  content: `确定删除名称为 ${typename} 的数据源？`,
                  okText: "确认",
                  cancelText: "取消",
                  onOk: async () => {
                    try {
                      modal.update({ okButtonProps: { loading: true } });

                      await deleteSource({ variables: { id } });

                      modal.update({ okButtonProps: { loading: false } });

                      toast({
                        description: "删除成功",
                        status: "success",
                        isClosable: true,
                      });
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

    columns.push();

    const options: TableOptions<any> = {
      columns,
      data: data?.sourceConnection.edges?.map((item) => item.node) || [],
      loading,
    };

    return options;
  }, [
    data?.sourceConnection.edges,
    deleteSource,
    form,
    getSource,
    loading,
    toast,
  ]);

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
        <Table {...tableProps} />

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
              ></DataSourceForm>
            )}

            {selectedSource?.type === "VirtualSource" && (
              <VirtualSourceForm></VirtualSourceForm>
            )}
          </Form>
        </Modal>
      </Page>
    </>
  );
};

SourceList.layout = ProjectLayout;

export default SourceList;
