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
import Link from "next/link";
import { useRouter } from "next/router";

import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const menu = [
  {
    name: "仪表盘",
    path: "/dashboards",
  },
  {
    name: "图表",
    path: "/charts",
  },
  {
    name: "数据集",
    path: "/clips",
  },
  {
    name: "数据源",
    path: "/sources",
  },
];

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}
    >
      <Container py={4} maxW="var(--chakra-sizes-7xl)">
        <Flex justify="space-between">
          <HStack spacing="4">
            <Image h="32px" alt="logo" src="/dataclip.png" />
            {isDesktop && (
              <ButtonGroup variant="ghost">
                {menu.map((item) => (
                  <Link key={item.path} href={item.path} passHref>
                    <Button as="a" isActive={router.pathname === item.path}>
                      {item.name}
                    </Button>
                  </Link>
                ))}
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
