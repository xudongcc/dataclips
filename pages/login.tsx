import {
  Button,
  chakra,
  Container,
  createIcon,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import { PC } from "../interfaces/PageComponent";

const GitHubIcon = createIcon({
  displayName: "GitHubIcon",
  path: (
    <path
      fill="currentColor"
      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
    />
  ),
});

interface LoginPageProps {
  csrfToken: string;
  providers: Record<string, ClientSafeProvider>;
}

const LoginPage: PC<LoginPageProps> = ({ csrfToken }) => {
  const { data, status } = useSession();

  console.log("status", data, status);

  return (
    <Container maxW="md" py={{ base: "12", md: "24" }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
              登录
            </Heading>
            <Text color="muted">不需要密码，这样更安全。</Text>
          </Stack>
        </Stack>

        <Stack spacing="6">
          {/* <chakra.form method="post" action="/api/auth/signin/email">
            <Stack spacing="4">
              <chakra.input
                type="hidden"
                name="csrfToken"
                defaultValue={csrfToken}
              />
              <Input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="输入你的邮箱"
              />
              <Button type="submit" variant="primary">
                登录
              </Button>
            </Stack>
          </chakra.form> */}

          {/* <HStack>
            <Divider />
            <Text fontSize="sm" color="muted">
              或
            </Text>
            <Divider />
          </HStack> */}

          <Stack spacing="3">
            <Button
              variant="secondary"
              leftIcon={<GitHubIcon boxSize="5" />}
              iconSpacing="3"
              onClick={() => signIn("github")}
            >
              GitHub
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      csrfToken: (await getCsrfToken()) || null,
      providers: await getProviders(),
    },
  };
};

export default LoginPage;
