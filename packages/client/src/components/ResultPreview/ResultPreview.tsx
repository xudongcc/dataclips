import { FC } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

export interface ResultPreviewProps {
  size?: 'sm' | 'md' | 'lg';
  fields: string[];
  values: (string | number | boolean | Date)[][];
}

export const ResultPreview: FC<ResultPreviewProps> = ({
  size,
  fields,
  values,
}) => {
  return (
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
  );
};
