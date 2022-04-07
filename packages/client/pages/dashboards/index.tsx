import { Link, useToast, Divider, Center, Text } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { Page } from "../../components/common/Page";
import { PC } from "../../interfaces/PageComponent";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import ProjectLayout from "../../layouts/ProjectLayout";
import { Table } from "../../components/common/Table";
import { useDashboardConnectionQuery } from "../../generated/graphql";
import { Form, Input } from "antd";
import { Modal } from "../../components/common/Modal";

import { Column, TableOptions } from "react-table";
import moment from "moment";
import { useCreateDashboardMutation } from "../../hooks/useCreateDashboardMutation";
import { useDeleteDashboardMutation } from "../../hooks/useDeleteDashboardMutation";

const DashBoardList: PC = () => {
  const router = useRouter();
  const toast = useToast();
  const [form] = Form.useForm();

  // 创建仪表盘的弹窗
  const [isCreateDashboardModalVisible, setIsCreateDashboardModalVisible] =
    useState(false);

  const { data: dashboardListData, loading } = useDashboardConnectionQuery({
    variables: { first: 100 },
  });

  const [createDashboard, { loading: createDashboardLoading }] =
    useCreateDashboardMutation();

  const [deleteDashboard] = useDeleteDashboardMutation();

  const handleDeleteDashboard = useCallback(
    async (deleteId: string) => {
      try {
        if (deleteId) {
          await deleteDashboard({ variables: { id: deleteId } });

          toast({
            description: "删除成功",
            status: "success",
            isClosable: true,
          });
        }
      } catch (err) {
        console.log("err", err);
      }
    },
    [deleteDashboard, toast]
  );

  const tableProps = useMemo<TableOptions<any>>(() => {
    const columns: Column<any>[] = [
      {
        Header: "name",
        accessor: "name",
        Cell: ({
          row: {
            original: { id, name },
          },
        }) => {
          return (
            <NextLink href={`/dashboards/${id}`} passHref>
              <Link color="blue.500">{name}</Link>
            </NextLink>
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
        Header: () => {
          return (
            <Text w="100%" textAlign="center">
              operation
            </Text>
          );
        },
        accessor: "operation",
        Cell: ({
          row: {
            original: { id, name },
          },
        }) => {
          return (
            <Center>
              <Link
                color="blue.500"
                onClick={() => {
                  router.push(`/dashboards/${id}/edit`);
                }}
              >
                编辑
              </Link>

              <Divider orientation="vertical" px={2}></Divider>

              <Link
                color="red.500"
                onClick={() => {
                  const modal = Modal.confirm({
                    okButtonProps: { danger: true },
                    title: "删除仪表盘",
                    okText: "确定",
                    cancelText: "取消",
                    content: `确认删除名称为 ${name} 的仪表盘？`,
                    onOk: async () => {
                      modal.update({
                        okButtonProps: { loading: true },
                      });

                      await handleDeleteDashboard(id);

                      modal.update({
                        okButtonProps: { loading: false },
                      });
                    },
                  });
                }}
              >
                删除
              </Link>
            </Center>
          );
        },
      },
    ];

    columns.push();

    const options: TableOptions<any> = {
      columns,
      data:
        dashboardListData?.dashboardConnection.edges?.map(
          (item) => item.node
        ) || [],
      loading,
    };

    return options;
  }, [
    dashboardListData?.dashboardConnection.edges,
    handleDeleteDashboard,
    loading,
    router,
  ]);

  const handleCloseCreateDashboardModal = useCallback(() => {
    setIsCreateDashboardModalVisible(false);
    form.resetFields();
  }, [form]);

  const handleCreateDashboard = useCallback(async () => {
    const values = form.getFieldsValue();

    await createDashboard({
      variables: {
        input: {
          name: values.dashboardName,
        },
      },
    });
  }, [createDashboard, form]);

  return (
    <>
      <Head>
        <title>仪表盘</title>
      </Head>

      <Page
        title="仪表盘"
        primaryAction={{
          text: "创建仪表盘",
          onClick: () => {
            setIsCreateDashboardModalVisible(true);
          },
        }}
      >
        <Table {...tableProps} />

        {/* 创建仪表盘的弹窗 */}
        <Modal
          title="创建仪表盘"
          okText="确认"
          cancelText="取消"
          okButtonProps={{ loading: createDashboardLoading }}
          onOk={async () => {
            try {
              await form.validateFields();

              await handleCreateDashboard();

              toast({
                description: "创建成功",
                status: "success",
                isClosable: true,
              });

              handleCloseCreateDashboardModal();
            } catch (err) {
              console.error(err);
            }
          }}
          visible={isCreateDashboardModalVisible}
          onCancel={handleCloseCreateDashboardModal}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="仪表盘名称"
              style={{ marginBottom: 0 }}
              name="dashboardName"
              rules={[{ required: true, message: "请输入仪表盘名称" }]}
            >
              <Input placeholder="请输入仪表盘名称" />
            </Form.Item>
          </Form>
        </Modal>
      </Page>
    </>
  );
};

DashBoardList.layout = ProjectLayout;

export default DashBoardList;
