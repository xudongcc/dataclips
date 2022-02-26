import { FC, useCallback } from 'react';
import { ButtonGroup, Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import moment from 'moment';
import saveAs from 'file-saver';

export interface DownloadButtonGroupProps {
  token: string;
}

export const DownloadButtonGroup: FC<DownloadButtonGroupProps> = ({
  token,
}) => {
  const handleDownload = useCallback(
    (extname: string) => {
      saveAs(
        `/clips/${token}${extname}`,
        `${moment().format('YYYYMMDD-HHmmss')}${extname}`,
      );
    },
    [token],
  );

  return (
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
  );
};
