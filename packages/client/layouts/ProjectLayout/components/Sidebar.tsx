import {
  Button,
  Flex,
  Image,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { menu } from "./Navbar";

import Link from "next/link";

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

            <VStack spacing="1">
              {menu.map((item) => (
                <Link key={item.path} href={item.path} passHref>
                  <Button
                    as="a"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                    isActive={router.pathname === item.path}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </VStack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
