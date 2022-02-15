import { FC } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

export interface DataSourcePreviewProps {
  size?: 'sm' | 'md' | 'lg';
  data: Record<string, string | number | boolean | Date>[];
}

export const DataSourcePreview: FC<DataSourcePreviewProps> = ({
  size,
  data,
}) => {
  return (
    <Table variant="simple" size={size}>
      {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

      <Thead>
        <Tr>
          {Object.entries(data[0]).map(([key]) => (
            <Th>{key}</Th>
          ))}
        </Tr>
      </Thead>

      <Tbody>
        {data?.map((row) => (
          <Tr>
            {Object.values(row).map((value) => (
              <Td>{value}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
