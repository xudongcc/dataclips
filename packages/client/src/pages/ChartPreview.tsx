import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { ChartResultPreview } from "../components/ChartResultPreview";
import { Loading } from "../components/Loading";
import { useChartQuery } from "../generated/graphql";
import { useQueryResult } from "../hooks/useQueryResult";

const ChartPreview: FC = () => {
  const { chartId } = useParams<{ chartId: string }>();

  const { data, loading } = useChartQuery({
    variables: { id: chartId! },
    skip: !chartId,
  });

  const { data: result, isLoading } = useQueryResult(data?.chart.clipId);

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{result.name ? `${result.name} | 数据剪藏` : `数据剪藏`}</title>
      </Helmet>

      {data?.chart.type && data?.chart.config && result && (
        <Box h="100vh">
          <ChartResultPreview
            type={data.chart.type}
            config={{
              keyField: data.chart.config.groupCol,
              valueField: data.chart.config.valueCol,
            }}
            result={result}
          />
        </Box>
      )}
    </>
  );
};

export default ChartPreview;
