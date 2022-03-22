import { Flex, Spinner } from "@chakra-ui/react";
import { FC } from "react";

export const Loading: FC = () => {
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Spinner />
    </Flex>
  );
};
