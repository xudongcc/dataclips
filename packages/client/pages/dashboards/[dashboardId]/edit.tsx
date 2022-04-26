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
import { cloneDeep, omit } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { Loading } from "../../../components/common/Loading";
import { Page } from "../../../components/common/Page";
import {
  DashboardItemType,
  DashboardLayout,
  DashboardChartItem,
  DashboardDividerItem,
  DashboardMarkdownItem,
} from "../../../components/dashboard/DashboardLayout";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Dropdown,
  Button,
  Menu,
} from "antd";
import { Modal } from "../../../components/common/Modal";
import { Markdown } from "../../../components/chart/ChartResultPreview/components";

const { Option } = Select;
const { TextArea } = Input;

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
  // 编辑仪表盘标签的 form
  const [editDashboardTagsForm] = Form.useForm();
  // 添加分隔线的 form
  const [dividerNameForm] = Form.useForm();
  // 添加或编辑卡片的 form
  const [addOrEditCardForm] = Form.useForm();
  // 添加 markdown 的form
  const [mdForm] = Form.useForm();

  // 当前表单弹窗的操作类型
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

  // 拖拽项
  const [dragItems, setDragItems] = useState<
    Array<DashboardDividerItem | DashboardChartItem | DashboardMarkdownItem>
  >([]);

  // 创建或编辑卡片的弹窗
  const [isAddOrEditCardModalVisible, setIsAddOrEditCardModalVisible] =
    useState(false);

  // 编辑标签弹窗
  const [isEditDashboardTagsModalVisible, setIsEditDashboardTagsModalVisible] =
    useState(false);

  // 编辑仪表盘名称弹窗
  const [isEditDashboardNameModalVisible, setIsEditDashboardNameModalVisible] =
    useState(false);

  // 分割线弹窗
  const [isDividerModalVisible, setIsDividerModalVisible] = useState(false);

  // markdown弹窗
  const [isAddOrEditMarkdownModalVisible, setIsAddOrEditMarkdownModalVisible] =
    useState(false);

  const handleCloseAddOrEditChartModal = useCallback(() => {
    setIsAddOrEditCardModalVisible(false);
    addOrEditCardForm.resetFields();
    setOperation({
      type: OperationType.ADD,
    });
  }, [addOrEditCardForm]);

  const handleCloseEditDashboardNameModal = useCallback(() => {
    setIsEditDashboardNameModalVisible(false);
    editDashboardNameForm.resetFields();
  }, [editDashboardNameForm]);

  const handleCloseEditDashboardTagsModal = useCallback(() => {
    setIsEditDashboardTagsModalVisible(false);
    editDashboardTagsForm.resetFields();
  }, [editDashboardTagsForm]);

  const handleCloseDividerModal = useCallback(() => {
    setIsDividerModalVisible(false);
    dividerNameForm.resetFields();
  }, [dividerNameForm]);

  const handleCloseAddOrEditMarkdownModal = useCallback(() => {
    setIsAddOrEditMarkdownModalVisible(false);
    mdForm.resetFields();
    setOperation({
      type: OperationType.ADD,
    });
  }, [mdForm]);

  const handleUpdateDashboard = useCallback(
    async (goPreview?: boolean) => {
      try {
        const dashboardName =
          editDashboardNameForm.getFieldValue("dashboardName");
        const tags = editDashboardTagsForm.getFieldValue("tags");

        await updateDashboard({
          variables: {
            id: dashboardId,
            input: {
              name: dashboardName,
              tags: tags,
              config: {
                ...data?.dashboard?.config,
                blocks: dragItems.map((item) => ({
                  ...item,
                  // 当前接口不给传递 i
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
      editDashboardTagsForm,
      updateDashboard,
      dashboardId,
      data?.dashboard?.config,
      dragItems,
      toast,
      router,
    ]
  );

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

  // 获取和设置所有拖拽项
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
        extra={
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    setIsAddOrEditCardModalVisible(true);
                  }}
                >
                  图表
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setIsDividerModalVisible(true);
                  }}
                >
                  分割线
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setIsAddOrEditMarkdownModalVisible(true);
                  }}
                >
                  Markdown
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="large">添加块</Button>
          </Dropdown>
        }
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
              setIsEditDashboardNameModalVisible(true);
            },
          },
          {
            text: "编辑标签",
            onClick: () => {
              editDashboardTagsForm.setFieldsValue({
                tags: data?.dashboard?.tags,
              });
              setIsEditDashboardTagsModalVisible(true);
            },
          },
        ]}
      >
        <DashboardLayout
          type="edit"
          onLayoutChange={handleSetChartItemLayout}
          layout={dragItems.map((item) => item.position)}
          dragItems={dragItems}
          extraConfig={{
            chart: {
              onEditCardClick: (item) => {
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
              onDeleteClick: (id) => {
                const deleteIndex = dragItems.findIndex(
                  (item) => item.id === id
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

                  if (data?.chart?.clip?.id) {
                    router.push(`/clips/${data?.chart?.clip?.id}`);
                  }
                } catch (err) {
                  console.error("err", err);
                }
              },
            },
            divider: {
              onDividerDelete: (id) => {
                const deleteDividerIndex = dragItems.findIndex(
                  (dragItem) => dragItem.id === id
                );

                if (deleteDividerIndex !== -1) {
                  dragItems.splice(deleteDividerIndex, 1);

                  setDragItems([...dragItems]);
                }
              },
            },
            markdown: {
              onDeleteClick: (id) => {
                const deleteDividerIndex = dragItems.findIndex(
                  (dragItem) => dragItem.id === id
                );

                if (deleteDividerIndex !== -1) {
                  dragItems.splice(deleteDividerIndex, 1);

                  setDragItems([...dragItems]);
                }
              },
              onEditBlockClick: (item) => {
                mdForm.setFieldsValue({
                  name: item?.name,
                  content: item?.markdown?.content,
                  hiddenName: !!item?.hiddenName,
                });

                setOperation({
                  type: OperationType.EDIT,
                  key: item.id,
                });

                setIsAddOrEditMarkdownModalVisible(true);
              },
            },
          }}
        />

        {/* 添加或编辑卡片的弹窗 */}
        <Modal
          title={`${operation.type === OperationType.EDIT ? "编辑" : "添加"}块`}
          visible={isAddOrEditCardModalVisible}
          onCancel={handleCloseAddOrEditChartModal}
          okButtonProps={{ loading: getChartLoading }}
          onOk={async () => {
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
                    y: Infinity,
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
                  setOperation({ type: OperationType.ADD });
                }
              }

              handleCloseAddOrEditChartModal();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <Form form={addOrEditCardForm} layout="vertical">
            <Form.Item label="图表名称" name="name">
              <Input placeholder="输入图表名称" />
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
          visible={isEditDashboardNameModalVisible}
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

        {/* 编辑仪表盘标签弹窗 */}
        <Modal
          title="编辑仪表盘标签"
          okButtonProps={{ loading: getChartLoading || updateDashboardLoading }}
          visible={isEditDashboardTagsModalVisible}
          onCancel={handleCloseEditDashboardTagsModal}
          onOk={async () => {
            await handleUpdateDashboard();
            handleCloseEditDashboardTagsModal();
          }}
        >
          <Form form={editDashboardTagsForm} layout="vertical">
            <Form.Item
              name="tags"
              label="仪表盘标签"
              style={{ marginBottom: 0 }}
            >
              <Select allowClear mode="tags" placeholder="使用标签" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 添加分割线弹窗 */}
        <Modal
          title="添加分割线"
          onCancel={handleCloseDividerModal}
          visible={isDividerModalVisible}
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
                  y: Infinity,
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
            <Form.Item name="dividerName" label="分割线名称">
              <Input placeholder="请输入分割线名称" />
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

        {/* 添加或编辑 markdown 的弹窗 */}
        <Modal
          title={`${
            operation.type === OperationType.ADD ? "添加" : "编辑"
          } Markdown`}
          width={1200}
          visible={isAddOrEditMarkdownModalVisible}
          onCancel={handleCloseAddOrEditMarkdownModal}
          onOk={() => {
            const values = mdForm.getFieldsValue();

            const id = uuidv4();
            const current = {
              id,
              type: DashboardItemType.MARKDOWN,
              hiddenName: values?.hiddenName || false,
              name: values?.name,
              markdown: {
                content: values?.content,
              },
              position: {
                i: id,
                x: 0,
                y: Infinity,
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
              setOperation({ type: OperationType.ADD });
            }

            handleCloseAddOrEditMarkdownModal();
          }}
          bodyStyle={{
            maxHeight: 510,
          }}
        >
          <Form layout="vertical" form={mdForm}>
            <Row gutter={16}>
              <Col span={12}>
                <div
                  style={{
                    overflow: "hidden scroll",
                    height: 455,
                  }}
                >
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                      <Markdown content={getFieldValue("content")}></Markdown>
                    )}
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item label="Markdown 名称" name="name">
                  <Input placeholder="输入 Markdown 名称" />
                </Form.Item>

                <Form.Item label="Markdown 内容" name="content">
                  <TextArea
                    autoSize={{ minRows: 13, maxRows: 13 }}
                    placeholder="输入 Markdown 语法"
                  />
                </Form.Item>

                <Form.Item noStyle name="hiddenName" valuePropName="checked">
                  <Checkbox>是否隐藏标题</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Page>
    </>
  );
};

DashBoardEdit.layout = ProjectLayout;

export default DashBoardEdit;
