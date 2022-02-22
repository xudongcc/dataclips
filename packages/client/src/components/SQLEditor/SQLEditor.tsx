import Editor from '@monaco-editor/react';

import { FC, useCallback } from 'react';
import { Box, useColorModeValue, useToken } from '@chakra-ui/react';

export interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SQLEditor: FC<SQLEditorProps> = ({ value, onChange }) => {
  const theme = useColorModeValue('dataclips-light', 'dataclips-dark');
  const [
    lightBackground,
    lightLineHighlightBackground,
    darkBackground,
    darkLineHighlightBackground,
  ] = useToken('colors', ['white', 'gray.200', 'gray.900', 'gray.700']);

  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue || '');
    },
    [onChange],
  );

  const handleBeforeMount = useCallback(
    (monaco) => {
      monaco.editor.defineTheme('dataclips-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': lightBackground,
          'editor.lineHighlightBackground': lightLineHighlightBackground,
        },
      });

      monaco.editor.defineTheme('dataclips-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': darkBackground,
          'editor.lineHighlightBackground': darkLineHighlightBackground,
        },
      });
    },
    [
      lightBackground,
      lightLineHighlightBackground,
      darkBackground,
      darkLineHighlightBackground,
    ],
  );

  return (
    <Box h="200px">
      <Editor
        height="100%"
        theme={theme}
        defaultLanguage="sql"
        options={{
          suggestOnTriggerCharacters: true,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            verticalScrollbarSize: 16,
          },
        }}
        value={value}
        onChange={handleChange}
        beforeMount={handleBeforeMount}
      />
    </Box>
  );
};
