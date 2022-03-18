import ProjectLayout from "../../layouts/ProjectLayout";
import { useRouter } from "next/router";

const ChartList = () => {
  const router = useRouter();

  console.log("router", router);

  return <>chart list</>;
};

ChartList.layout = ProjectLayout;

export default ChartList;
