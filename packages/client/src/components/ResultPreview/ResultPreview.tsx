import { FC, useCallback } from 'react';
import {
  chakra,
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ButtonGroup,
  Button,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import moment from 'moment';
import ms from 'ms';
import { saveAs } from 'file-saver';
import { ResultFragment } from '@/generated/graphql';

export interface ResultPreviewProps {
  slug?: string;
  result: ResultFragment;
}

export const ResultPreview: FC<ResultPreviewProps> = ({ slug, result }) => {
  const handleDownload = useCallback(
    (extname: string) => {
      saveAs(
        `/clips/${slug}${extname}`,
        `${moment().format('YYYYMMDD-HHmmss')}${extname}`,
      );
    },
    [slug],
  );

  return (
    <Box p={4} minH="full">
      {result.error ? (
        <Box
          p={4}
          bgColor="red.50"
          borderWidth={1}
          borderColor="red.500"
          borderRadius="md"
          color="red.500"
        >
          <Text fontWeight="bold">查询错误</Text>
          <chakra.pre>{result.error}</chakra.pre>
        </Box>
      ) : (
        <>
          <Flex mb={4} justify="space-between">
            <HStack spacing={4}>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  计数
                </Box>
                <Box>{result.values.length} 行</Box>
              </Box>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  耗时
                </Box>
                <Box>{ms(result.duration)}</Box>
              </Box>
              <Box fontSize="xs" lineHeight="none">
                <Box mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  更新时间
                </Box>
                <Box>
                  {moment(result.finishedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Box>
              </Box>
            </HStack>

            {slug ? (
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.csv')}
                >
                  CSV
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.xlsx')}
                >
                  XLSX
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  onClick={() => handleDownload('.json')}
                >
                  JSON
                </Button>
              </ButtonGroup>
            ) : null}
          </Flex>

          <Table
            borderWidth={1}
            borderRadius="md"
            sx={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <Thead>
              <Tr>
                {result.fields.map((field, cellIndex) => (
                  <Th key={cellIndex}>{field}</Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {result.values?.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((value, cellIndex) => (
                    <Td key={cellIndex}>{value}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};
