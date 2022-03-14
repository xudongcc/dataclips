import { Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Logo } from "./Logo";
import { NavButton } from "./NavButton";

export const Sidebar = () => {
  const navigate = useNavigate();

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
            <Logo />

            <Stack spacing="1">
              <NavButton
                label="图表"
                onClick={() => {
                  navigate("/charts");
                }}
                isActive={window.location.pathname === "/charts"}
              ></NavButton>
              <NavButton
                onClick={() => {
                  navigate("/clips");
                }}
                label="数据集"
                isActive={window.location.pathname === "/clips"}
              ></NavButton>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
