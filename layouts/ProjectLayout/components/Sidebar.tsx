import { Flex, Image, Stack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { NavButton } from "./NavButton";

export const Sidebar = () => {
  const router = useRouter();

  return (
    <Flex as="section" minH="100vh">
      <Flex
        flex="1"
        w="100%"
        overflowY="auto"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        maxW={{ base: "full", sm: "xs" }}
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Stack width="inherit" justify="space-between" spacing="1">
          <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <Image h="32px" alt="logo" src="/dataclip.png" />

            <Stack spacing="1">
              <NavButton
                label="图表"
                onClick={() => {
                  router.push("/charts");
                }}
                isActive={router.pathname === "/charts"}
              ></NavButton>
              <NavButton
                onClick={() => {
                  router.push("/clips");
                }}
                label="数据集"
                isActive={router.pathname === "/clips"}
              ></NavButton>
              <NavButton
                onClick={() => {
                  router.push("/sources");
                }}
                label="数据源"
                isActive={router.pathname === "/sources"}
              ></NavButton>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
