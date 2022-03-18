import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Image,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box as="nav" boxShadow={useColorModeValue("sm", "sm-dark")}>
      <Container py={4} maxW="var(--chakra-sizes-7xl)">
        <Flex justify="space-between">
          <HStack spacing="4">
            <Image h="32px" alt="logo" src="/dataclip.png" />
            {isDesktop && (
              <ButtonGroup variant="ghost" spacing="1">
                <Button
                  isActive={router.pathname === "/charts"}
                  onClick={() => {
                    router.push("/charts");
                  }}
                >
                  图表
                </Button>
                <Button
                  isActive={router.pathname === "/clips"}
                  onClick={() => {
                    router.push("/clips");
                  }}
                >
                  数据集
                </Button>

                <Button
                  isActive={router.pathname === "/sources"}
                  onClick={() => {
                    router.push("/sources");
                  }}
                >
                  数据源
                </Button>
              </ButtonGroup>
            )}
          </HStack>
          {!isDesktop && (
            <>
              <ToggleButton
                isOpen={isOpen}
                aria-label="Open Menu"
                onClick={onToggle}
              />
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                isFullHeight
                preserveScrollBarGap
                // Only disabled for showcase
                trapFocus={false}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <Sidebar />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
