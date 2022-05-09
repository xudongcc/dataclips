import Head from "next/head";
import NextLink from "next/link";
import { Page } from "../../components/common/Page";
import { PC } from "../../interfaces/PageComponent";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import ProjectLayout from "../../layouts/ProjectLayout";
import {
  useDashboardConnectionLazyQuery,
  useDeleteDashboardMutation,
  useCreateDashboardMutation,
} from "../../generated/graphql";
import { Form, Input, Divider, Space, notification, Button } from "antd";
import { Modal } from "../../components/common/Modal";

import {
  GraphQLTable,
  GraphQLTableColumnType,
} from "../../components/common/GraphQLTable";
import { ValueType } from "../../components/common/SimpleTable";

const DashBoardList: PC = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  // 创建仪表盘的弹窗
  const [isCreateDashboardModalVisible, setIsCreateDashboardModalVisible] =
    useState(false);

  const [getDashboards, { data, loading, refetch }] =
    useDashboardConnectionLazyQuery({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
    });

  const [createDashboard, { loading: createDashboardLoading }] =
    useCreateDashboardMutation();

  const [deleteDashboard] = useDeleteDashboardMutation();

  const columns: GraphQLTableColumnType<any>[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        return (
          <NextLink href={`/dashboards/${record?.id}`} passHref>
            <Button style={{ padding: 0 }} type="link">
              {name}
            </Button>
          </NextLink>
        );
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
      align: "center",
      dataIndex: "updatedAt",
      sorter: true,
      key: "updatedAt",
      valueType: ValueType.DATE_TIME,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                router.push(`/dashboards/${record?.id}/edit`);
              }}
            >
              编辑
            </Button>

            <Divider type="vertical" />

            <Button
              onClick={() => {
                const modal = Modal.confirm({
                  title: "删除仪表盘",
                  content: `确定删除名称为 ${record?.name} 的仪表盘？`,
                  okText: "确定",
                  okButtonProps: {
                    danger: true,
                  },
                  cancelText: "取消",
                  onOk: async () => {
                    try {
                      modal.update({ okButtonProps: { loading: true } });

                      await deleteDashboard({ variables: { id: record?.id } });

                      modal.update({ okButtonProps: { loading: false } });

                      notification.success({
                        message: "删除成功",
                        placement: "bottom",
                      });

                      refetch();
                    } catch (err) {
                      console.error("err", err);
                    }
                  },
                });
              }}
              type="link"
              style={{ padding: 0 }}
              danger
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

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

    refetch();
  }, [createDashboard, form, refetch]);

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
        <GraphQLTable
          id="dashboards"
          pageSize={100}
          // pageInfo={data?.clipConnection?.pageInfo}
          options={false}
          onVariablesChange={(variables) => {
            getDashboards({ variables });
          }}
          columns={columns}
          dataSource={data?.dashboardConnection?.edges?.map(
            (item) => item?.node
          )}
          loading={loading}
        />

        {/* 创建仪表盘的弹窗 */}
        <Modal
          title="创建仪表盘"
          okButtonProps={{ loading: createDashboardLoading }}
          onOk={async () => {
            try {
              await form.validateFields();

              await handleCreateDashboard();

              notification.success({
                message: "创建成功",
                placement: "bottom",
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
