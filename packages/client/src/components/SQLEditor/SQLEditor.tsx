import Editor, { EditorProps } from '@monaco-editor/react';

import { FC, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

export interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SQLEditor: FC<SQLEditorProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue || '');
    },
    [onChange],
  );

  return (
    <Box h="200px">
      <Editor
        height="100%"
        defaultLanguage="sql"
        options={{
          minimap: {
            enabled: false,
          },
        }}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
};
