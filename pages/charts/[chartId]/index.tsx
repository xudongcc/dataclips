import { useChartQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { Loading } from "../../../components/Loading";
import { Box } from "@chakra-ui/react";
import { ChartResultPreview } from "../../../components/ChartResultPreview";

const ChartPreview = () => {
  const router = useRouter();

  const { chartId } = router.query as { chartId: string };

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  const { data: result, isLoading } = useQueryResult(data?.chart.clipId);

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <>
      {data?.chart.type && data?.chart.config && result && (
        <Box h="100vh">
          <ChartResultPreview
            type={data.chart.type}
            config={{
              groupCol: data.chart.config.groupCol,
              valueCol: data.chart.config.valueCol,
            }}
            result={result}
          />
        </Box>
      )}
    </>
  );
};

export default ChartPreview;
