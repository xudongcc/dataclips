import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  useChartConnectionLazyQuery,
  useDeleteChartMutation,
} from "../../generated/graphql";
import { chartTypeMap } from "../../components/chart/ChartEditTab";
import { Page } from "../../components/common/Page";
import Head from "next/head";
import { Modal } from "../../components/common/Modal";
import {
  GraphQLTable,
  GraphQLTableColumnType,
} from "../../components/common/GraphQLTable";
import { ValueType } from "../../components/common/SimpleTable";
import { Divider, Space, Button, notification } from "antd";

const ChartList = () => {
  const router = useRouter();

  const [getCharts, { data, loading, refetch }] = useChartConnectionLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const [deleteChart] = useDeleteChartMutation();

  const columns: GraphQLTableColumnType<any>[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        return (
          <NextLink href={`/charts/${record?.id}`} passHref>
            <Button type="link" style={{ padding: 0 }}>
              {name}
            </Button>
          </NextLink>
        );
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type) => chartTypeMap[type],
    },
    {
      title: "标签",
      dataIndex: "tags",
      // filterType: FilterType.TAG,
      key: "tags",
      width: 200,
      valueType: {
        type: ValueType.TAG,
        onClick: () => {},
      },
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
                router.push(`/charts/${record?.id}/edit`);
              }}
            >
              编辑
            </Button>

            <Divider type="vertical" />

            <Button
              type="link"
              style={{ padding: 0 }}
              danger
              onClick={() => {
                const modal = Modal.confirm({
                  title: "删除图表",
                  content: `确定删除名称为 ${record?.name} 的图表？`,
                  okText: "确定",
                  okButtonProps: {
                    danger: true,
                  },
                  cancelText: "取消",
                  onOk: async () => {
                    try {
                      modal.update({ okButtonProps: { loading: true } });

                      await deleteChart({ variables: { id: record?.id } });

                      modal.update({ okButtonProps: { loading: false } });

                      notification.success({
                        message: "删除成功",
                        placement: "bottom",
                      });

                      await refetch();
                    } catch (err) {
                      console.error("err", err);
                    }
                  },
                });
              }}
              color="red.500"
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>图表</title>
      </Head>

      <Page
        title="图表"
        primaryAction={{
          text: "创建图表",
          onClick: () => {
            router.push("/charts/create");
          },
        }}
      >
        <GraphQLTable
          id="charts"
          pageSize={100}
          // pageInfo={data?.clipConnection?.pageInfo}
          options={false}
          onVariablesChange={(variables) => {
            getCharts({ variables });
          }}
          columns={columns}
          dataSource={data?.chartConnection?.edges?.map((item) => item?.node)}
          loading={loading}
        />
      </Page>
    </>
  );
};

ChartList.layout = ProjectLayout;

export default ChartList;
