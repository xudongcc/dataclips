import { Flex, Spinner } from "@chakra-ui/react";
import { FC } from "react";

interface LoadingProps {
  width?: string | number;
  height?: string | number;
}

export const Loading: FC<LoadingProps> = ({ width, height }) => {
  return (
    <Flex
      w={width || "100%"}
      h={height || "100vh"}
      align="center"
      justify="center"
    >
      <Spinner />
    </Flex>
  );
};
