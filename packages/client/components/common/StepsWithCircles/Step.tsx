import { Divider, HStack, StackProps } from "@chakra-ui/react";
import * as React from "react";

import { StepCircle } from "./StepCircle";

interface StepProps extends StackProps {
  isCompleted: boolean;
  isActive: boolean;
  isLastStep: boolean;
  stepDescription?: string;
}

export const Step = (props: StepProps) => {
  const { isActive, isCompleted, isLastStep, stepDescription, ...stackProps } =
    props;

  return (
    <>
      <HStack flex={isLastStep ? "0" : "1"} spacing="0" {...stackProps}>
        <StepCircle
          stepDescription={stepDescription}
          isActive={isActive}
          isCompleted={isCompleted}
        />
        {!isLastStep && (
          <Divider
            orientation="horizontal"
            borderWidth="1px"
            borderColor={isCompleted ? "blue.500" : "inherit"}
          />
        )}
      </HStack>
    </>
  );
};
