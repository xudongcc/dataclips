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
import { useState } from "react";
import { useClipConnectionQuery } from "../../generated/graphql";
import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { useDeleteClipMutation } from "../../hooks/useDeleteClipMutation";
import { useMemo, useCallback } from "react";
import { Column, TableOptions } from "react-table";
import moment from "moment";
import { Page } from "../../components/Page";
import { Table } from "../../components/Table";

const ClipList = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClipId, setSelectedClipId] = useState<string>("");

  const { data } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const [deleteClip, { loading }] = useDeleteClipMutation();

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
                router.push(`/clips/${id}/edit`);
              }}
              color="blue.500"
            >
              {name}
            </Link>
          );
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
                setSelectedClipId(id);
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
      data: data?.clipConnection.edges?.map((item: any) => item.node) || [],
    };

    return options;
  }, [data?.clipConnection.edges, onOpen, router]);

  const handleCloseDeleteModal = useCallback(() => {
    setSelectedClipId("");
    onClose();
  }, [onClose]);

  const handleDeleteClip = useCallback(async () => {
    if (selectedClipId) {
      await deleteClip({ variables: { id: selectedClipId } });

      toast({
        description: "删除成功",
        status: "success",
        isClosable: true,
      });

      handleCloseDeleteModal();
    }
  }, [deleteClip, selectedClipId, toast, handleCloseDeleteModal]);

  return (
    <Page
      title="数据集"
      primaryAction={{
        text: "创建数据集",
        onClick: () => {
          router.push("/clips/create");
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
          <ModalHeader>删除数据集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>确定删除 id 为 {selectedClipId} 的数据集？</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseDeleteModal}>
              取消
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteClip}
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

ClipList.layout = ProjectLayout;

export default ClipList;
