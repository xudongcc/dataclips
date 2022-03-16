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
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { omit } from "lodash";
import moment from "moment";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column, TableOptions } from "react-table";
import * as Yup from "yup";

import { Table } from "../../components/Table";
import {
  DatabaseSource,
  DatabaseType,
  UpdateDatabaseSourceInput,
  useSourceConnectionQuery,
  useSourceLazyQuery,
  useUpdateDatabaseSourceMutation,
  useUpdateVirtualSourceMutation,
  VirtualSource,
} from "../../generated/graphql";
import { useDeleteSourceMutation } from "../../hooks/useDeleteSourceMutation";
import { Page } from "../../layouts/ProjectLayout/components/Page";
import { DataSourceForm } from "./components/DataSourceForm";
import { VirtualSourceForm } from "./components/VirtualSourceForm";

const dataSourceValidObj = {
  dataSource: Yup.object({
    name: Yup.string().required(),
    host: Yup.string().required(),
    port: Yup.number().required(),
    database: Yup.string().required(),
    username: Yup.string().required(),
    type: Yup.string().required(),
  }),
};

const virtualSourceValidObj = {
  virtualSource: Yup.object().shape({
    name: Yup.string().required(),
    tables: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        clipId: Yup.string().required(),
      })
    ),
  }),
};

export const SourceList: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useSourceConnectionQuery({
    variables: { first: 100 },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [selectedSource, setSelectedSource] = useState<{
    type: "DatabaseSource" | "VirtualSource";
    id: string;
  }>();

  const [validationDatabaseTypeSchema, setValidationDatabaseTypeSchema] =
    useState<Record<string, any>>({});

  const [getSource, { data: sourceData, loading: sourceLoading }] =
    useSourceLazyQuery();

  const [deleteSource, { loading: deleteSourceLoading }] =
    useDeleteSourceMutation();

  const [updateDatabaseSource, { loading: updateDatabaseSourceLoading }] =
    useUpdateDatabaseSourceMutation();

  const [updateVirtualSource, { loading: updateVirtualSourceLoading }] =
    useUpdateVirtualSourceMutation();

  const form = useFormik({
    initialValues: {
      dataSource: {
        name: "",
        host: "",
        port: undefined as undefined | number,
        database: "",
        username: "",
        password: "",
        type: "" as DatabaseType,
      },
      virtualSource: {
        name: "",
        tables: [{ name: "", clipId: "", id: "" }],
      },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      try {
        if (selectedSource?.id) {
          if (selectedSource?.type === "DatabaseSource") {
            const input: Record<string, any> = omit(values.dataSource, [
              "password",
            ]);

            if (values.dataSource.password) {
              input.password = values.dataSource.password;
            }

            await updateDatabaseSource({
              variables: {
                id: selectedSource.id,
                input: {
                  ...(input as UpdateDatabaseSourceInput),
                },
              },
            });
          }

          if (selectedSource?.type === "VirtualSource") {
            await updateVirtualSource({
              variables: {
                id: selectedSource.id,
                input: values.virtualSource,
              },
            });
          }

          // 因为 handleCloseEditModal 有清空错误步骤，这里使用不了，所以不调用函数了
          onEditClose();
          setSelectedSource(undefined);

          form.setValues(form.initialValues);
          toast({
            description: "更新成功",
            status: "success",
            isClosable: true,
          });
        }
      } catch (err) {
        console.log("err", err);
      }
    },
    validationSchema: Yup.object().shape({
      ...validationDatabaseTypeSchema,
    }),
  });

  const handleCloseEditModal = useCallback(() => {
    onEditClose();
    setSelectedSource(undefined);
    form.setErrors({});
  }, [onEditClose, form]);

  const tableProps = useMemo<TableOptions<any>>(() => {
    const columns: Column<any>[] = [
      {
        Header: "name",
        accessor: "name",
        Cell: ({
          row: {
            original: { id, name, typename },
          },
        }) => {
          return (
            <Link
              onClick={async () => {
                onEditOpen();
                setSelectedSource({ id, type: typename });

                const result = await getSource({ variables: { id } });

                const source = result.data?.source as
                  | DatabaseSource
                  | VirtualSource
                  | undefined;

                try {
                  if (typename === "DatabaseSource") {
                    setValidationDatabaseTypeSchema(dataSourceValidObj);

                    if (source) {
                      form.setValues({
                        ...form.values,
                        dataSource: {
                          name: (source as DatabaseSource).name,
                          host: (source as DatabaseSource).host,
                          port: (source as DatabaseSource).port!,
                          database: (source as DatabaseSource).database!,
                          username: (source as DatabaseSource).username,
                          password: "",
                          type: (source as DatabaseSource).type,
                        },
                      });
                    }
                  }

                  if (typename === "VirtualSource") {
                    setValidationDatabaseTypeSchema(virtualSourceValidObj);

                    if (source) {
                      console.log("source", source);
                      form.setValues({
                        ...form.values,
                        virtualSource: {
                          name: (source as VirtualSource).name,
                          tables: (source as VirtualSource).tables.map(
                            (table) => ({
                              name: table.name,
                              clipId: table.clipId,
                              id: table.id,
                            })
                          ),
                        },
                      });
                    }
                  }
                } catch (err) {
                  console.log("err", err);
                }
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
            original: { id, typename },
          },
        }) => {
          return (
            <Link
              onClick={() => {
                setSelectedSource({ id, type: typename });
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
      data: data?.sourceConnection.edges?.map((item) => item.node) || [],
    };

    return options;
  }, [data?.sourceConnection.edges, navigate, onOpen]);

  console.log(form.values);

  const handleDeleteSource = useCallback(async () => {
    try {
      if (selectedSource?.id) {
        await deleteSource({ variables: { id: selectedSource.id } });

        toast({
          description: "删除成功",
          status: "success",
          isClosable: true,
        });

        setSelectedSource(undefined);
        onClose();
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [deleteSource, onClose, selectedSource, toast]);

  const handleCloseDeleteModal = useCallback(() => {
    onClose();
    setSelectedSource(undefined);
    form.setValues(form.initialValues);
  }, [onClose, form]);

  const handleGetCurrentTypeEditForm = useCallback(
    (f: any) => {
      return [
        {
          type: "DatabaseSource",
          component: <DataSourceForm form={f}></DataSourceForm>,
        },
        {
          type: "VirtualSource",
          component: <VirtualSourceForm form={f}></VirtualSourceForm>,
        },
      ].find((item) => item.type === selectedSource?.type)?.component;
    },
    [selectedSource?.type]
  );

  return (
    <Page
      primaryAction={{
        text: "创建数据源",
        onClick: () => {
          navigate("/sources/create");
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

      {/* 编辑 modal */}
      <Modal isOpen={isEditOpen} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>编辑数据源</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={form.handleSubmit}>
            <ModalBody>
              <VStack spacing={4} pt={4}>
                {!sourceLoading && sourceData
                  ? handleGetCurrentTypeEditForm(form)
                  : "请稍后"}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCloseEditModal}>
                取消
              </Button>
              <Button
                colorScheme="red"
                type="submit"
                isLoading={
                  updateDatabaseSourceLoading ||
                  sourceLoading ||
                  updateVirtualSourceLoading
                }
              >
                确定
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* 删除 modal */}
      <Modal isOpen={isOpen} onClose={handleCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>删除数据源</ModalHeader>
          <ModalCloseButton />
          <ModalBody>确定删除 id 为 {selectedSource?.id} 的数据源？</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseDeleteModal}>
              取消
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteSource}
              isLoading={deleteSourceLoading}
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};
