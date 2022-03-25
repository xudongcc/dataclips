import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PC } from "../interfaces/PageComponent";
import ProjectLayout from "../layouts/ProjectLayout";

const HomePage: PC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/clips");
  });

  return (
    <>
      <Head>
        <title>Dataclips</title>
        <meta name="description" content="Dataclips" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>Home</Box>
    </>
  );
};

HomePage.layout = ProjectLayout;

export default HomePage;
