import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  HStack,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  DatabaseType,
  useCreateDatabaseSourceMutation,
  useCreateVirtualSourceMutation,
} from "../../generated/graphql";
import { DataSourceForm } from "./components/DataSourceForm";
import { Step } from "./components/StepsWithCircles/Step";
import { useStep } from "./components/StepsWithCircles/useStep";
import { VirtualSourceForm } from "./components/VirtualSourceForm";

const dataSourceValidObj = {
  dataSource: Yup.object({
    name: Yup.string().required(),
    host: Yup.string().required(),
    port: Yup.number().required(),
    database: Yup.string().required(),
    username: Yup.string().required(),
    password: Yup.string().required(),
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

export const SourceCreate: FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const numberOfSteps = 2;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  const [validationDatabaseTypeSchema, setValidationDatabaseTypeSchema] =
    useState<Record<string, any>>({});

  const [createDataBaseSource, { loading: createDataBaseSourceLoading }] =
    useCreateDatabaseSourceMutation();
  const [createVirtualSource, { loading: createVirtualSourceLoading }] =
    useCreateVirtualSourceMutation();

  const form = useFormik({
    initialValues: {
      type: "",
      dataSource: {
        name: "",
        host: "",
        port: undefined,
        database: "",
        username: "",
        password: "",
        type: "" as DatabaseType,
      },
      virtualSource: {
        name: "",
        tables: [{ name: "", clipId: "" }],
      },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      try {
        if (values.type === "DatabaseSource") {
          await createDataBaseSource({
            variables: {
              input: {
                ...values.dataSource,
              },
            },
          });
        }

        if (values.type === "VirtualSource") {
          await createVirtualSource({
            variables: {
              input: {
                ...values.virtualSource,
              },
            },
          });
        }

        toast({
          description: "创建成功",
          status: "success",
          isClosable: true,
        });

        navigate(`/sources`);
      } catch (err) {
        console.log("err", err);
      }
    },
    validationSchema: Yup.object().shape({
      type: Yup.string().required(),
      ...validationDatabaseTypeSchema,
    }),
  });

  return (
    <Box>
      <Container py={{ base: "4", md: "8" }}>
        <HStack spacing="0" justify="space-evenly">
          {[...Array(numberOfSteps)].map((_, step) => (
            <Step
              stepDescription={step === 0 ? "数据源" : "配置"}
              key={step}
              cursor={!form.values.type ? "not-allowed" : "pointer"}
              onClick={() => {
                if (!form.values.type) {
                  return;
                }

                setValidationDatabaseTypeSchema(
                  form.values.type === "DatabaseSource"
                    ? dataSourceValidObj
                    : virtualSourceValidObj
                );
                form.setErrors({});
                setStep(step);
              }}
              isActive={currentStep === step}
              isCompleted={currentStep > step}
              isLastStep={numberOfSteps === step + 1}
            />
          ))}
        </HStack>

        <form onSubmit={form.handleSubmit}>
          {currentStep === 0 && (
            <VStack spacing={4} pt={4}>
              <Text textAlign="center">请选择数据源类型</Text>

              <FormControl isInvalid={!!form.errors.type}>
                <Select
                  name="type"
                  value={form.values.type}
                  onChange={form.handleChange}
                  placeholder="请选择数据源"
                >
                  <option value="DatabaseSource">DatabaseSource</option>
                  <option value="VirtualSource">VirtualSource</option>
                </Select>

                <FormErrorMessage>请选择数据源</FormErrorMessage>
              </FormControl>

              <Button
                onClick={async () => {
                  const res = await form.validateForm();

                  if (!res.type) {
                    setValidationDatabaseTypeSchema(
                      form.values.type === "DatabaseSource"
                        ? dataSourceValidObj
                        : virtualSourceValidObj
                    );

                    setStep(1);
                    form.setErrors({});
                  }
                }}
              >
                下一步
              </Button>
            </VStack>
          )}

          {currentStep === 1 && (
            <VStack spacing={4} pt={4}>
              {form.values.type === "DatabaseSource" && (
                <DataSourceForm form={form} />
              )}

              {form.values.type === "VirtualSource" && (
                <VirtualSourceForm form={form} />
              )}

              <Button
                isLoading={
                  createDataBaseSourceLoading || createVirtualSourceLoading
                }
                type="submit"
              >
                创建
              </Button>
            </VStack>
          )}
        </form>
      </Container>
    </Box>
  );
};
