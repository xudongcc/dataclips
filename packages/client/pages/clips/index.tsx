import { useToast, Link } from "@chakra-ui/react";
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
  FilterType,
  GraphQLTable,
  GraphQLTableColumnType,
} from "../../components/common/GraphQLTable";
import { ValueType } from "../../components/common/SimpleTable";
import { Space, Divider } from "antd";

const ClipList = () => {
  const router = useRouter();
  const toast = useToast();

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
            <Link color="blue.500">{name}</Link>
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
            <Link
              color="blue.500"
              onClick={() => {
                router.push(`/clips/${record?.id}/edit`);
              }}
            >
              编辑
            </Link>

            <Divider type="vertical" />

            <Link
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

                      toast({
                        description: "删除成功",
                        status: "success",
                        isClosable: true,
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
            </Link>
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
          pageInfo={data?.clipConnection?.pageInfo}
          pageSize={50}
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
