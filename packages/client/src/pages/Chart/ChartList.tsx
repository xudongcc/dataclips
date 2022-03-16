import {
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column, TableOptions } from "react-table";

import { Table } from "../../components/Table";
import { useChartConnectionQuery } from "../../generated/graphql";
import { useDeleteChartMutation } from "../../hooks/useDeleteChartMutation";
import { Page } from "../../layouts/ProjectLayout/components/Page";

export const ChartList: FC = () => {
  const navigate = useNavigate();
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
                navigate(`/charts/${id}/edit`);
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
  }, [data?.chartConnection.edges, navigate, onOpen]);

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
  }, [deleteChart, onClose, selectedChartId, toast, handleCloseDeleteModal]);

  return (
    <Page
      primaryAction={{
        text: "创建图表",
        onClick: () => {
          navigate("/charts/create");
        },
      }}
    >
      {tableProps.data.length ? (
        <Table {...tableProps}></Table>
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
