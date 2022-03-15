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
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column, TableOptions } from "react-table";

import { Table } from "../../components/Table";
import { useChartConnectionQuery } from "../../generated/graphql";
import { useDeleteChartMutation } from "../../hooks/useDeleteChartMutation";
import { Page } from "../../layouts/components";

export const ChartList: FC = () => {
  let navigate = useNavigate();
  const toast = useToast();

  const { data } = useChartConnectionQuery({
    variables: { first: 100 },
  });
  const [deleteChart, { loading }] = useDeleteChartMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChartId, setSelectedChartId] = useState<string>("");

  const handleDeleteChart = useCallback(async () => {
    try {
      if (selectedChartId) {
        await deleteChart({ variables: { id: selectedChartId } });

        toast({
          description: "删除成功",
          status: "success",
          isClosable: true,
        });

        setSelectedChartId("");
        onClose();
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [deleteChart, onClose, selectedChartId, toast]);

  const tableProps = useMemo<TableOptions<any>>(() => {
    const columns: Column<any>[] = [
      {
        Header: "id",
        accessor: "id",
        Cell: ({
          row: {
            values: { id },
          },
        }) => {
          return (
            <Link
              onClick={() => {
                navigate(`/charts/${id}/edit`);
              }}
              color="blue.500"
            >
              {id}
            </Link>
          );
        },
      },
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "type",
        accessor: "type",
      },
      {
        Header: "operation",
        accessor: "operation",
        Cell: ({
          row: {
            values: { id },
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

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedChartId("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>删除图表</ModalHeader>
          <ModalCloseButton />
          <ModalBody>确定删除 id 为 {selectedChartId} 的图表？</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setSelectedChartId("");
              }}
            >
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
