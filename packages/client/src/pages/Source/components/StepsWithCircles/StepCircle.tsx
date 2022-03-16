import { Box, Circle, Icon, SquareProps, Text } from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";

interface RadioCircleProps extends SquareProps {
  isCompleted: boolean;
  isActive: boolean;
  stepDescription?: string;
}

export const StepCircle = (props: RadioCircleProps) => {
  const { isCompleted, isActive, stepDescription } = props;
  return (
    <Box position="relative">
      {stepDescription && (
        <Text
          whiteSpace="nowrap"
          position="absolute"
          top="-100%"
          textAlign="center"
          left="50%"
          transform="translateX(-50%)"
        >
          {stepDescription}
        </Text>
      )}

      <Circle
        size="8"
        bg={isCompleted ? "blue.500" : "inherit"}
        borderWidth={isCompleted ? "0" : "2px"}
        borderColor={isActive ? "blue.500" : "inherit"}
        {...props}
      >
        {isCompleted ? (
          <Icon as={HiCheck} color="#fff" boxSize="5" />
        ) : (
          <Circle bg={isActive ? "blue.500" : "border"} size="3" />
        )}
      </Circle>
    </Box>
  );
};
