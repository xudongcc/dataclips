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
} from "@chakra-ui/react";
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
                router.push(`/dashboards/${id}/edit`);
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
              color="red.500"
              onClick={() => {
                setSelectedDashboardId(id);
                onDeleteDashboardModalOpen();
              }}
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
    console.log(form.values.dashboardName);
    await createDashboard({
      variables: {
        input: {
          name: form.values.dashboardName,
        },
      },
    });
  }, [createDashboard, form]);

  return (
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
                  // router.push("/dashboards/create");
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
          <ModalBody>确定删除 id 为 {selectedDashboardId} 的仪表盘？</ModalBody>

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
  );
};

DashBoardList.layout = ProjectLayout;

export default DashBoardList;
