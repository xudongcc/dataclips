import NextLink from "next/link";
import Head from "next/head";
import {
  useClipConnectionLazyQuery,
  useDeleteClipMutation,
} from "../../generated/graphql";
import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { Page } from "../../components/common/Page";
import { Modal } from "../../components/common/Modal";
import {
  GraphQLTable,
  GraphQLTableColumnType,
} from "../../components/common/GraphQLTable";
import { ValueType } from "../../components/common/SimpleTable";
import { Space, Divider, notification, Button } from "antd";

const ClipList = () => {
  const router = useRouter();

  const [getClips, { data, loading, refetch }] = useClipConnectionLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const [deleteClip] = useDeleteClipMutation();

  const columns: GraphQLTableColumnType<any>[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name, record) => {
        return (
          <NextLink href={`/clips/${record?.id}`} passHref>
            <Button type="link" style={{ padding: 0 }}>
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
      title: "最后编辑时间",
      align: "center",
      dataIndex: "lastEditAt",
      key: "lastEditAt",
      sorter: true,
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
                router.push(`/clips/${record?.id}/edit`);
              }}
            >
              编辑
            </Button>

            <Divider type="vertical" />

            <Button
              type="link"
              danger
              style={{ padding: 0 }}
              onClick={() => {
                const modal = Modal.confirm({
                  title: "删除数据集",
                  content: `确定删除名称为 ${record?.name} 的数据集？`,
                  okText: "确定",
                  okButtonProps: {
                    danger: true,
                  },
                  cancelText: "取消",
                  onOk: async () => {
                    try {
                      modal.update({ okButtonProps: { loading: true } });

                      await deleteClip({ variables: { id: record?.id } });

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
        <title>数据集</title>
      </Head>

      <Page
        title="数据集"
        primaryAction={{
          text: "创建数据集",
          onClick: () => {
            router.push("/clips/create");
          },
        }}
      >
        <GraphQLTable
          id="clips"
          pageSize={100}
          // pageInfo={data?.clipConnection?.pageInfo}
          options={false}
          onVariablesChange={(variables) => {
            getClips({ variables });
          }}
          columns={columns}
          dataSource={data?.clipConnection?.edges?.map((item) => item?.node)}
          loading={loading}
        />
      </Page>
    </>
  );
};

ClipList.layout = ProjectLayout;

export default ClipList;
