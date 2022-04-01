import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import moment from "moment";
import ms from "ms";
import { FC } from "react";

import { ResultFragment } from "../../../../generated/graphql";

export interface StatResultProps {
  result: ResultFragment;
}

export const StatResult: FC<StatResultProps> = ({ result }) => {
  const infoLabelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <HStack spacing={4}>
      <Box fontSize="xs" lineHeight="none">
        <Box mb={2} color={infoLabelColor}>
          计数
        </Box>
        <Box>{result?.values?.length} 行</Box>
      </Box>
      <Box fontSize="xs" lineHeight="none">
        <Box mb={2} color={infoLabelColor}>
          耗时
        </Box>
        <Box>{result?.duration && ms(result?.duration)}</Box>
      </Box>
      <Box fontSize="xs" lineHeight="none">
        <Box mb={2} color={infoLabelColor}>
          更新时间
        </Box>
        <Box>{moment(result?.finishedAt).format("YYYY-MM-DD HH:mm:ss")}</Box>
      </Box>
    </HStack>
  );
};
