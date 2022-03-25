import {
  Avatar,
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Portal,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Loading } from "../../../components/Loading";
import { NavButton } from "./NavButton";
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
  const router = useRouter();

  const session = useSession();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const boxShadow = useColorModeValue("sm", "sm-dark");
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleLogout = useCallback(() => {
    signOut();
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, router]);

  if (session.status !== "authenticated") {
    return <Loading />;
  }

  return (
    <Box as="nav" bg="bg-surface" boxShadow={boxShadow}>
      <Container py={4} maxW="var(--chakra-sizes-7xl)">
        <Flex justify="space-between">
          <HStack spacing="4">
            {isDesktop ? (
              <>
                <Image h="32px" alt="logo" src="/dataclip.png" />

                <ButtonGroup variant="ghost" spacing="2">
                  {menu.map((item) => (
                    <Link key={item.path} href={item.path} passHref>
                      <Button as="a" isActive={router.pathname === item.path}>
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </ButtonGroup>
              </>
            ) : (
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
                  trapFocus={false}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <Flex as="section" minH="100vh">
                      <Flex
                        flex="1"
                        w="100%"
                        overflowY="auto"
                        boxShadow={boxShadow}
                        maxW={{ base: "full", sm: "xs" }}
                        py={{ base: "6", sm: "8" }}
                        px={{ base: "4", sm: "6" }}
                      >
                        <Stack
                          width="inherit"
                          justify="space-between"
                          spacing="1"
                        >
                          <Stack
                            spacing={{ base: "5", sm: "6" }}
                            shouldWrapChildren
                          >
                            <Image h="32px" alt="logo" src="/dataclip.png" />

                            <Stack spacing="1">
                              {menu.map((item) => (
                                <NavButton
                                  key={item.path}
                                  label={item.name}
                                  onClick={() => {
                                    router.push(item.path);
                                    onClose();
                                  }}
                                  isActive={router.pathname === item.path}
                                />
                              ))}
                            </Stack>
                          </Stack>
                        </Stack>
                      </Flex>
                    </Flex>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </HStack>

          <HStack spacing="4">
            <Menu placement="bottom-end">
              <MenuButton>
                <Avatar
                  boxSize="10"
                  name={session.data?.user?.name}
                  src={session.data?.user?.image}
                />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={handleLogout}>登出</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
