import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { PC } from "../../../interfaces/PageComponent";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { Layout } from "react-grid-layout";
import {
  useDashboardQuery,
  useChartConnectionQuery,
  useUpdateDashboardMutation,
  useChartLazyQuery,
} from "../../../generated/graphql";
import { cloneDeep, maxBy, omit } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { Loading } from "../../../components/common/Loading";
import { Page } from "../../../components/common/Page";
import {
  DashboardItemType,
  DashboardLayout,
  DashboardChartItem,
  DashboardDividerItem,
} from "../../../components/dashboard/DashboardLayout";
import { Checkbox, Form, Input, Select, Space } from "antd";
import { Modal } from "../../../components/common/Modal";

const { Option } = Select;

enum OperationType {
  ADD = "ADD",
  EDIT = "EDIT",
}

interface Operation {
  type: OperationType;
  key?: string;
}

const DashBoardEdit: PC = () => {
  const toast = useToast();
  const router = useRouter();
  // 编辑仪表盘名称的 form
  const [editDashboardNameForm] = Form.useForm();
  // 添加分隔线的 form
  const [dividerNameForm] = Form.useForm();
  // 添加或编辑卡片的 form
  const [addOrEditCardForm] = Form.useForm();

  const [operation, setOperation] = useState<Operation>({
    type: OperationType.ADD,
  });

  const { dashboardId } = router.query as { dashboardId: string };

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const { data: chartConnectionData } = useChartConnectionQuery({
    variables: { first: 100 },
  });

  const [getChart, { loading: getChartLoading }] = useChartLazyQuery();

  const [updateDashboard, { loading: updateDashboardLoading }] =
    useUpdateDashboardMutation();

  const [dragItems, setDragItems] = useState<
    Array<DashboardDividerItem | DashboardChartItem>
  >([]);

  // 创建或编辑卡片的弹窗
  const [isAddOrEditCardModalVisible, setIsAddOrEditCardModalVisible] =
    useState(false);

  // 编辑仪表盘名称
  const [isDashboardNameModalVisible, setIsDashboardNameModalVisible] =
    useState(false);

  // 编辑线名称弹窗
  const [isDividerNameModalVisible, setIsDividerNameModalVisible] =
    useState(false);

  const handleCloseAddChartModal = useCallback(() => {
    setIsAddOrEditCardModalVisible(false);
    addOrEditCardForm.resetFields();
    setOperation({ type: OperationType.ADD });
  }, [addOrEditCardForm]);

  const handleCloseEditDashboardNameModal = useCallback(() => {
    setIsDashboardNameModalVisible(false);
    editDashboardNameForm.resetFields();
  }, [editDashboardNameForm]);

  const handleCloseDividerModal = useCallback(() => {
    setIsDividerNameModalVisible(false);
    dividerNameForm.resetFields();
  }, [dividerNameForm]);

  const handleUpdateDashboard = useCallback(
    async (goPreview?: boolean) => {
      try {
        const value = editDashboardNameForm.getFieldValue("dashboardName");

        await updateDashboard({
          variables: {
            id: dashboardId,
            input: {
              name: value,
              config: {
                ...data?.dashboard?.config,
                blocks: dragItems.map((item) => ({
                  ...item,
                  position: { ...omit(item?.position, ["i"]) },
                })),
              },
            },
          },
        });

        toast({ title: "保存成功" });

        if (goPreview) {
          router.push(`/dashboards/${dashboardId}`);
        }

        return;
      } catch (err) {
        console.error(err);
      }
    },
    [
      editDashboardNameForm,
      updateDashboard,
      dashboardId,
      data?.dashboard?.config,
      dragItems,
      toast,
      router,
    ]
  );

  const handleAddOrEditChartCard = useCallback(async () => {
    try {
      const values = await addOrEditCardForm.validateFields();

      const { data } = await getChart({
        variables: {
          id: values.chartId,
        },
      });

      if (data?.chart) {
        const id = uuidv4();
        const current: DashboardChartItem = {
          id,
          hiddenName: values.hiddenName,
          name: values.name,
          chart: {
            id: data.chart.id,
          },
          type: DashboardItemType.CHART,
          position: {
            i: id,
            x: 0,
            y: maxBy(dragItems, (item) => item?.position?.y)?.position?.y || 0,
            w: 12,
            h: 6,
          },
        };
        if (operation.type === OperationType.ADD) {
          setDragItems([...dragItems, current]);
        } else {
          const updateIndex = dragItems.findIndex(
            (dragItem) => dragItem.id === operation?.key
          );
          if (updateIndex !== -1) {
            dragItems[updateIndex] = {
              ...current,
              position: dragItems[updateIndex].position,
              id: dragItems[updateIndex].id,
            };
          }
          setDragItems([...dragItems]);
          setOperation({ type: OperationType.EDIT });
        }
      }
      handleCloseAddChartModal();
    } catch (err) {
      console.error(err);
    }
  }, [
    addOrEditCardForm,
    dragItems,
    getChart,
    handleCloseAddChartModal,
    operation?.key,
    operation.type,
  ]);

  // 布局发生变化时
  const handleSetChartItemLayout = useCallback(
    (newLayout: Layout[]) => {
      const newDragItems = cloneDeep(dragItems);

      newLayout.forEach((layout) => {
        const itemIndex = dragItems.findIndex(
          (item) => item.position.i === layout.i
        );

        if (itemIndex !== -1) {
          newDragItems[itemIndex] = {
            ...newDragItems[itemIndex],
            position: {
              ...newDragItems[itemIndex].position,
              i: layout.i,
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            },
          };
        }
      });

      setDragItems(newDragItems);
    },
    [dragItems]
  );

  useEffect(() => {
    if (data?.dashboard?.config?.blocks?.length) {
      // 添加 position 的 i，返回的数据没有
      const blocks = data.dashboard.config.blocks.map((item) => ({
        ...item,
        position: {
          ...item?.position,
          i: item.id,
        },
      }));
      setDragItems(blocks);
    }
  }, [data?.dashboard?.config?.blocks]);

  if (loading) {
    return <Loading width="100%" />;
  }

  return (
    <>
      <Head>
        <title>{data?.dashboard?.name} - 编辑 - 仪表盘</title>
      </Head>

      <Page
        title={data?.dashboard?.name}
        primaryAction={{
          text: "保存",
          onClick: () => {
            handleUpdateDashboard(true);
          },
          loading: updateDashboardLoading,
        }}
        secondaryActions={[
          {
            text: "编辑名称",
            onClick: () => {
              editDashboardNameForm.setFieldsValue({
                dashboardName: data?.dashboard?.name,
              });
              setIsDashboardNameModalVisible(true);
            },
          },
          {
            text: "添加间隔线",
            onClick: () => {
              setIsDividerNameModalVisible(true);
            },
          },
          {
            text: "添加卡片",
            onClick: () => {
              setIsAddOrEditCardModalVisible(true);
            },
          },
        ]}
      >
        <DashboardLayout
          type="edit"
          onLayoutChange={handleSetChartItemLayout}
          layout={dragItems.map((item) => item.position)}
          dragItems={dragItems}
          cardExtraConfig={{
            onEditCardClick: (item, onClose) => {
              onClose();

              addOrEditCardForm.setFieldsValue({
                name: item?.name,
                chartId: item?.chart.id,
                hiddenName: !!item?.hiddenName,
              });

              setOperation({
                type: OperationType.EDIT,
                key: item.id,
              });

              setIsAddOrEditCardModalVisible(true);
            },
            onDeleteClick: (item, onClose) => {
              onClose();

              const deleteIndex = dragItems.findIndex(
                (chartCard) => chartCard.id === item.id
              );

              if (deleteIndex !== -1) {
                dragItems.splice(deleteIndex, 1);
                setDragItems([...dragItems]);
              }
            },
            onEditChartClick: (item) => {
              router.push(`/charts/${item?.chart?.id}/edit`);
            },
            onPreviewClipClick: async (item) => {
              try {
                const { data } = await getChart({
                  variables: { id: item.chart?.id },
                });

                if (data?.chart?.clipId) {
                  router.push(`/clips/${data?.chart?.clipId}`);
                }
              } catch (err) {
                console.error("err", err);
              }
            },
          }}
          onDividerDelete={(id) => {
            const deleteDividerIndex = dragItems.findIndex(
              (dragItem) => dragItem.id === id
            );

            if (deleteDividerIndex !== -1) {
              dragItems.splice(deleteDividerIndex, 1);

              setDragItems([...dragItems]);
            }
          }}
        />

        {/* 添加或编辑卡片的弹窗 */}
        <Modal
          title={`${
            operation.type === OperationType.EDIT ? "编辑" : "添加"
          }卡片`}
          visible={isAddOrEditCardModalVisible}
          onCancel={handleCloseAddChartModal}
          okButtonProps={{ loading: getChartLoading }}
          onOk={async () => {
            await handleAddOrEditChartCard();
          }}
        >
          <Form form={addOrEditCardForm} layout="vertical">
            <Form.Item
              label="图表名称"
              name="name"
              rules={[{ required: true, message: "请输入图表名称" }]}
            >
              <Input placeholder="请输入图表名称"></Input>
            </Form.Item>

            <Form.Item
              name="chartId"
              label="图表"
              rules={[{ required: true, message: "请选择图表" }]}
            >
              <Select
                optionFilterProp="children"
                showSearch
                placeholder="请选择图表"
                onChange={(_, { children }: { children: string }) => {
                  const value = addOrEditCardForm.getFieldValue("name");

                  if (!value) {
                    addOrEditCardForm.setFieldsValue({
                      name: children,
                    });
                  }
                }}
              >
                {chartConnectionData?.chartConnection.edges.map(
                  ({ node: { id, name } }) => (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>

            <Form.Item noStyle name="hiddenName" valuePropName="checked">
              <Checkbox>是否隐藏标题</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

        {/* 编辑仪表盘名称弹窗 */}
        <Modal
          title="编辑仪表盘名称"
          okButtonProps={{ loading: getChartLoading || updateDashboardLoading }}
          visible={isDashboardNameModalVisible}
          onCancel={handleCloseEditDashboardNameModal}
          onOk={async () => {
            try {
              await editDashboardNameForm.validateFields();

              await handleUpdateDashboard();
              handleCloseEditDashboardNameModal();
            } catch (err) {
              console.error("err", err);
            }
          }}
        >
          <Form form={editDashboardNameForm} layout="vertical">
            <Form.Item
              name="dashboardName"
              label="仪表盘名称"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: "请输入仪表盘名称" }]}
            >
              <Input placeholder="请输入仪表盘名称"></Input>
            </Form.Item>
          </Form>
        </Modal>

        {/* 添加编辑线弹窗 */}
        <Modal
          title="添加分割线"
          onCancel={handleCloseDividerModal}
          visible={isDividerNameModalVisible}
          onOk={() => {
            const values = dividerNameForm.getFieldsValue();
            const id = uuidv4();

            setDragItems([
              ...dragItems,
              {
                id,
                type: DashboardItemType.DIVIDER,
                divider: {
                  orientation: (values?.orientation || "left") as any,
                  name: values?.dividerName,
                },
                position: {
                  i: id,
                  x: 0,
                  y: maxBy(dragItems, (item) => item.position.y).position.y,
                  w: 24,
                  h: 1,
                  maxH: 1,
                  minH: 1,
                },
              },
            ]);

            handleCloseDividerModal();
          }}
        >
          <Form form={dividerNameForm} layout="vertical">
            <Space direction="vertical"></Space>
            <Form.Item name="dividerName" label="分割线名称">
              <Input placeholder="请输入分割线名称"></Input>
            </Form.Item>

            <Form.Item
              style={{ marginBottom: 0 }}
              name="orientation"
              label="文本方向"
            >
              <Select
                optionFilterProp="children"
                showSearch
                placeholder="请选择文本方向"
              >
                <Option value="left">居左</Option>
                <Option value="center">居中</Option>
                <Option value="right">居右</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Page>
    </>
  );
};

DashBoardEdit.layout = ProjectLayout;

export default DashBoardEdit;
