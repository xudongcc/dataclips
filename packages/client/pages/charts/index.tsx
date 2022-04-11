import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useToast, Link, Text, Center, Divider } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo } from "react";
import { Table } from "../../components/common/Table";
import { useChartConnectionQuery } from "../../generated/graphql";
import { chartTypeMap } from "../../components/chart/ChartEditTab";
import moment from "moment";
import { Column, TableOptions } from "react-table";
import { Page } from "../../components/common/Page";
import { useDeleteChartMutation } from "../../hooks/useDeleteChartMutation";
import Head from "next/head";
import { Modal } from "../../components/common/Modal";

const ChartList = () => {
  const router = useRouter();

  const toast = useToast();

  const { data, loading: dataLoading } = useChartConnectionQuery({
    variables: { first: 100 },
  });
  const [deleteChart] = useDeleteChartMutation();

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
            <NextLink href={`/charts/${id}`} passHref>
              <Link color="blue.500">{name}</Link>
            </NextLink>
          );
        },
      },
      {
        Header: "type",
        accessor: "type",
        Cell: ({
          row: {
            values: { type },
          },
        }) => {
          return chartTypeMap[type];
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
                  router.push(`/charts/${id}/edit`);
                }}
              >
                编辑
              </Link>

              <Divider orientation="vertical" px={2}></Divider>

              <Link
                onClick={() => {
                  const modal = Modal.confirm({
                    title: "删除图表",
                    content: `确定删除名称为 ${name} 的图表吗？`,
                    okButtonProps: {
                      danger: true,
                    },
                    okText: "确定",
                    cancelText: "取消",
                    onOk: async () => {
                      modal.update({
                        okButtonProps: { loading: true },
                      });

                      await deleteChart({ variables: { id } });

                      toast({
                        description: "删除成功",
                        status: "success",
                        isClosable: true,
                      });

                      modal.update({
                        okButtonProps: { loading: false },
                      });
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
      data: data?.chartConnection.edges?.map((item) => item.node) || [],
      loading: dataLoading,
    };

    return options;
  }, [data?.chartConnection.edges, dataLoading, deleteChart, router, toast]);

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
        <Table {...tableProps} />
      </Page>
    </>
  );
};

ChartList.layout = ProjectLayout;

export default ChartList;
