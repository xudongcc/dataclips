import { FC, useCallback } from 'react';
import {
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
  Tfoot,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import moment from 'moment';
import ms from 'ms';
import { saveAs } from 'file-saver';

export interface ResultPreviewProps {
  slug: string;
  fields: string[];
  values: (string | number | boolean | Date)[][];
  duration: number;
  finishedAt: Date;
}

export const ResultPreview: FC<ResultPreviewProps> = ({
  slug,
  duration,
  fields,
  values,
  finishedAt,
}) => {
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
    <Box p={4}>
      <Flex mb={4} justify="space-between">
        <HStack spacing={4}>
          <Box fontSize="xs" lineHeight="none">
            <Box mb={2} color="gray.500">
              计数
            </Box>
            <Box>{values.length} 行</Box>
          </Box>
          <Box fontSize="xs" lineHeight="none">
            <Box mb={2} color="gray.500">
              耗时
            </Box>
            <Box>{ms(duration)}</Box>
          </Box>
          <Box fontSize="xs" lineHeight="none">
            <Box mb={2} color="gray.500">
              更新时间
            </Box>
            <Box>{moment(finishedAt).format('YYYY-MM-DD HH:mm:ss')}</Box>
          </Box>
        </HStack>

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
      </Flex>

      <Table
        borderWidth={1}
        borderRadius="md"
        sx={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

        <Thead>
          <Tr>
            {fields.map((field, cellIndex) => (
              <Th key={cellIndex}>{field}</Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {values?.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((value, cellIndex) => (
                <Td key={cellIndex}>{value}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
