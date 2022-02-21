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
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { saveAs } from 'file-saver';

export interface ResultPreviewProps {
  size?: 'sm' | 'md' | 'lg';
  slug: string;
  fields: string[];
  values: (string | number | boolean | Date)[][];
  finishedAt: Date;
}

export const ResultPreview: FC<ResultPreviewProps> = ({
  size,
  slug,
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
        <HStack spacing={2}>
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

      <Table variant="simple" size={size}>
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

        <Thead>
          <Tr>
            {fields.map((field) => (
              <Th>{field}</Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {values?.map((row) => (
            <Tr>
              {row.map((value) => (
                <Td>{value}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
