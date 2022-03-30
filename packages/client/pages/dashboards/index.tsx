import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Divider,
  Center,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { Page } from "../../components/Page";
import { PC } from "../../interfaces/PageComponent";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import ProjectLayout from "../../layouts/ProjectLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Table } from "../../components/Table";
import { useDashboardConnectionQuery } from "../../generated/graphql";

import { Column, TableOptions } from "react-table";
import moment from "moment";
import { useCreateDashboardMutation } from "../../hooks/useCreateDashboardMutation";
import { useDeleteDashboardMutation } from "../../hooks/useDeleteDashboardMutation";

const DashBoardList: PC = () => {
  const router = useRouter();
  const toast = useToast();

  // 创建仪表盘的弹窗
  const {
    isOpen: isCreateDashboardModalOpen,
    onOpen: onCreateDashboardModalOpen,
    onClose: onCreateDashboardModalClose,
  } = useDisclosure();

  // 删除仪表盘的弹窗
  const {
    isOpen: isDeleteDashboardModalOpen,
    onOpen: onDeleteDashboardModalOpen,
    onClose: onDeleteDashboardModalClose,
  } = useDisclosure();

  const [selectedDashboardId, setSelectedDashboardId] = useState<string>("");

  const { data: dashboardListData } = useDashboardConnectionQuery({
    variables: { first: 100 },
  });

  const [createDashboard, { loading: createDashboardLoading }] =
    useCreateDashboardMutation();

  const [deleteDashboard, { loading: deleteDashboardLoading }] =
    useDeleteDashboardMutation();

  const form = useFormik({
    initialValues: {
      dashboardName: "",
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: () => {},
    validationSchema: Yup.object().shape({
      dashboardName: Yup.string().required(),
    }),
  });

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
                router.push(`/dashboards/${id}`);
              }}
              color="blue.500"
            >
              {name}
            </Link>
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
            original: { id },
          },
        }) => {
          return (
            <Center>
              <Link
                color="blue.500"
                onClick={() => {
                  router.push(`/dashboards/${id}/edit`);
                }}
              >
                编辑
              </Link>

              <Divider orientation="vertical" px={2}></Divider>

              <Link
                color="red.500"
                onClick={() => {
                  setSelectedDashboardId(id);
                  onDeleteDashboardModalOpen();
                }}
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
      data:
        dashboardListData?.dashboardConnection.edges?.map(
          (item) => item.node
        ) || [],
    };

    return options;
  }, [
    dashboardListData?.dashboardConnection.edges,
    onDeleteDashboardModalOpen,
    router,
  ]);

  const handleCloseCreateDashboardModal = useCallback(() => {
    onCreateDashboardModalClose();
    form.setErrors({});
    form.setValues(form.initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCreateDashboardModalClose]);

  const handleCloseDeleteDashboardModal = useCallback(() => {
    onDeleteDashboardModalClose();
    setSelectedDashboardId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDeleteDashboardModalClose]);

  const handleDeleteDashboard = useCallback(async () => {
    try {
      if (selectedDashboardId) {
        await deleteDashboard({ variables: { id: selectedDashboardId } });

        toast({
          description: "删除成功",
          status: "success",
          isClosable: true,
        });

        handleCloseDeleteDashboardModal();
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [
    deleteDashboard,
    handleCloseDeleteDashboardModal,
    selectedDashboardId,
    toast,
  ]);

  const handleCreateDashboard = useCallback(async () => {
    await createDashboard({
      variables: {
        input: {
          name: form.values.dashboardName,
        },
      },
    });
  }, [createDashboard, form]);

  return (
    <>
      <Head>
        <title>仪表盘</title>
      </Head>

      <Page
        title="仪表盘"
        primaryAction={{
          text: "创建仪表盘",
          onClick: onCreateDashboardModalOpen,
        }}
      >
        <Table {...tableProps} />

        {/* 创建仪表盘的弹窗 */}
        <Modal
          isOpen={isCreateDashboardModalOpen}
          onClose={handleCloseCreateDashboardModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>创建仪表盘</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={!!form.errors.dashboardName}>
                <Input
                  name="dashboardName"
                  value={form.values.dashboardName}
                  onChange={form.handleChange}
                  placeholder="请输入仪表盘名称"
                />

                <FormErrorMessage>请输入仪表盘名字</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleCloseCreateDashboardModal}
              >
                取消
              </Button>
              <Button
                isLoading={createDashboardLoading}
                colorScheme="red"
                onClick={async () => {
                  const error = await form.validateForm();

                  if (!error?.dashboardName) {
                    await handleCreateDashboard();
                    handleCloseCreateDashboardModal();
                  }
                }}
              >
                确定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 删除仪表盘的弹窗 */}
        <Modal
          isOpen={isDeleteDashboardModalOpen}
          onClose={handleCloseDeleteDashboardModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>删除仪表盘</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              确定删除 id 为 {selectedDashboardId} 的仪表盘？
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleCloseDeleteDashboardModal}
              >
                取消
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteDashboard}
                isLoading={deleteDashboardLoading}
              >
                确定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Page>
    </>
  );
};

DashBoardList.layout = ProjectLayout;

export default DashBoardList;
