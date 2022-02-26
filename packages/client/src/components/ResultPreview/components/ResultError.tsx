import { FC } from 'react';
import { chakra, Box, Text } from '@chakra-ui/react';

export interface ResultErrorProps {
  error: string;
}

export const ResultError: FC<ResultErrorProps> = ({ error }) => {
  return (
    <Box
      p={4}
      bgColor="red.50"
      borderWidth={1}
      borderColor="red.500"
      borderRadius="md"
      color="red.500"
    >
      <Text fontWeight="bold">查询错误</Text>
      <chakra.pre>{error}</chakra.pre>
    </Box>
  );
};
