import { FC, useState } from 'react';
import { Page } from '@/components/Page';
import Editor from '@monaco-editor/react';
import { Button } from '@chakra-ui/react';

const DataClipEdit: FC = ({ children }) => {
  const [sql, SetSql] = useState('');

  return (
    <Page title="编辑数据剪辑">
      <Editor
        height="50vh"
        defaultLanguage="sql"
        defaultValue={sql}
        onChange={(value) => {
          if (value) {
            SetSql(value);
          }
        }}
      />

      <Button>保存</Button>
    </Page>
  );
};

export default DataClipEdit;
