import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import {
  useToast,
  useDisclosure,
  Link,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState, useCallback, useMemo } from "react";
import { Table } from "../../components/Table";
import { useChartConnectionQuery } from "../../generated/graphql";
import { chartTypeMap } from "../../components/ChartEditTab";
import moment from "moment";
import { Column, TableOptions } from "react-table";
import { Page } from "../../components/Page";
import { useDeleteChartMutation } from "../../hooks/useDeleteChartMutation";

const ChartList = () => {
  const router = useRouter();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChartId, setSelectedChartId] = useState<string>("");

  const { data } = useChartConnectionQuery({
    variables: { first: 100 },
  });
  const [deleteChart, { loading }] = useDeleteChartMutation();

  const handleCloseDeleteModal = useCallback(() => {
    onClose();
    setSelectedChartId("");
  }, [onClose]);

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
            <Link
              onClick={() => {
                router.push(`/charts/${id}/edit`);
              }}
              color="blue.500"
            >
              {name}
            </Link>
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
        Header: "createdAt",
        accessor: "createdAt",
        Cell: ({
          row: {
            values: { createdAt },
          },
        }) => {
          return moment(createdAt).format("YYYY-MM-DD HH:mm:ss");
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
            original: { id },
          },
        }) => {
          return (
            <Link
              onClick={() => {
                setSelectedChartId(id);
                onOpen();
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
      data: data?.chartConnection.edges?.map((item) => item.node) || [],
    };

    return options;
  }, [data?.chartConnection.edges, onOpen, router]);

  const handleDeleteChart = useCallback(async () => {
    try {
      if (selectedChartId) {
        await deleteChart({ variables: { id: selectedChartId } });

        toast({
          description: "删除成功",
          status: "success",
          isClosable: true,
        });

        handleCloseDeleteModal();
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [deleteChart, selectedChartId, toast, handleCloseDeleteModal]);

  return (
    <Page
      title="图表"
      primaryAction={{
        text: "创建图表",
        onClick: () => {
          router.push("/charts/create");
        },
      }}
    >
      {tableProps.data.length ? (
        <Table {...tableProps} />
      ) : (
        <Flex h="calc(100vh - 104px)" align="center" justify="center">
          暂无数据
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>删除图表</ModalHeader>
          <ModalCloseButton />
          <ModalBody>确定删除 id 为 {selectedChartId} 的图表？</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseDeleteModal}>
              取消
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteChart}
              isLoading={loading}
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

ChartList.layout = ProjectLayout;

export default ChartList;
