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
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box as="nav" boxShadow={useColorModeValue("sm", "sm-dark")}>
      <Container py={4} maxW="var(--chakra-sizes-7xl)">
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo />
            {isDesktop && (
              <ButtonGroup variant="ghost" spacing="1">
                <Button
                  isActive={window.location.pathname === "/charts"}
                  onClick={() => {
                    navigate("/charts");
                  }}
                >
                  图表
                </Button>
                <Button
                  isActive={window.location.pathname === "/clips"}
                  onClick={() => {
                    navigate("/clips");
                  }}
                >
                  数据集
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
