import { useToast, Link, Text, Divider, Center } from "@chakra-ui/react";
import NextLink from "next/link";
import Head from "next/head";
import { useClipConnectionQuery } from "../../generated/graphql";
import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useDeleteClipMutation } from "../../hooks/useDeleteClipMutation";
import { useMemo } from "react";
import { Column, TableOptions } from "react-table";
import moment from "moment";
import { Page } from "../../components/common/Page";
import { Table } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";

const ClipList = () => {
  const router = useRouter();
  const toast = useToast();

  const { data, loading: dataLoading } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const [deleteClip] = useDeleteClipMutation();

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
            <NextLink href={`/clips/${id}`} passHref>
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
                  router.push(`/clips/${id}/edit`);
                }}
              >
                编辑
              </Link>

              <Divider orientation="vertical" px={2}></Divider>

              <Link
                onClick={() => {
                  const modal = Modal.confirm({
                    title: "删除数据集",
                    content: `确定删除名称为 ${name} 的数据集？`,
                    okText: "确定",
                    okButtonProps: {
                      danger: true,
                    },
                    cancelText: "取消",
                    onOk: async () => {
                      try {
                        modal.update({ okButtonProps: { loading: true } });

                        await deleteClip({ variables: { id } });

                        modal.update({ okButtonProps: { loading: false } });

                        toast({
                          description: "删除成功",
                          status: "success",
                          isClosable: true,
                        });
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
            </Center>
          );
        },
      },
    ];

    columns.push();

    const options: TableOptions<any> = {
      columns,
      data: data?.clipConnection.edges?.map((item: any) => item.node) || [],
      loading: dataLoading,
    };

    return options;
  }, [data?.clipConnection.edges, dataLoading, deleteClip, router, toast]);

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
        <Table {...tableProps} />
      </Page>
    </>
  );
};

ClipList.layout = ProjectLayout;

export default ClipList;
