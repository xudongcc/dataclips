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
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  DatabaseType,
  useCreateDatabaseSourceMutation,
} from "../../generated/graphql";
import { DataSourceForm } from "./components/DataSourceForm";
import { Step } from "./components/StepsWithCircles/Step";
import { useStep } from "./components/StepsWithCircles/useStep";

export const SourceCreate = () => {
  const toast = useToast();
  let navigate = useNavigate();

  const numberOfSteps = 2;
  const [currentStep, { setStep }] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0,
  });

  const [createDataBaseSource, { loading }] = useCreateDatabaseSourceMutation();

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

          toast({
            description: "创建成功",
            status: "success",
            isClosable: true,
          });

          navigate(`/sources`);
        }
      } catch (err) {
        console.log("err", err);
      }
    },
    validationSchema: Yup.object().shape({
      type: Yup.string().required(),
      dataSource: Yup.object({
        name: Yup.string().required(),
        host: Yup.string().required(),
        port: Yup.number().required(),
        database: Yup.string().required(),
        username: Yup.string().required(),
        password: Yup.string().required(),
        type: Yup.string().required(),
      }),
    }),
  });

  return (
    <Box>
      <Container py={{ base: "4", md: "8" }}>
        <HStack spacing="0" justify="space-evenly">
          {[...Array(numberOfSteps)].map((_, step) => (
            <Step
              key={step}
              cursor={!form.values.type ? "not-allowed" : "pointer"}
              onClick={() => {
                if (!form.values.type) {
                  return;
                }

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
              <Text textAlign="center">请选择数据类型</Text>

              <FormControl isInvalid={!!form.errors.type}>
                <Select
                  name="type"
                  value={form.values.type}
                  onChange={form.handleChange}
                  placeholder="请选择数据源"
                >
                  <option value="DatabaseSource">DatabaseSource</option>
                </Select>

                <FormErrorMessage>请选择数据源</FormErrorMessage>
              </FormControl>

              <Button
                onClick={async () => {
                  const res = await form.validateForm();

                  if (!res.type) {
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
              <DataSourceForm form={form}></DataSourceForm>

              <Button isLoading={loading} type="submit">
                创建
              </Button>
            </VStack>
          )}
        </form>
      </Container>
    </Box>
  );
};
