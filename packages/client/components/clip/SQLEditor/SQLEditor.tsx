import { Box, useColorModeValue, useToken } from "@chakra-ui/react";
import Editor, { loader } from "@monaco-editor/react";
import { FC, useCallback, useEffect } from "react";
import { format } from "prettier-sql";

loader.config({
  paths: { vs: "/editor" },
});

export interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SQLEditor: FC<SQLEditorProps> = ({ value, onChange }) => {
  const theme = useColorModeValue("dataclips-light", "dataclips-dark");
  const [
    lightBackground,
    lightLineHighlightBackground,
    darkBackground,
    darkLineHighlightBackground,
  ] = useToken("colors", ["white", "gray.200", "gray.900", "gray.700"]);

  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue || "");
    },
    [onChange]
  );

  const handleBeforeMount = useCallback(
    (monaco) => {
      monaco.editor.defineTheme("dataclips-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": lightBackground,
          "editor.lineHighlightBackground": lightLineHighlightBackground,
        },
      });

      monaco.editor.defineTheme("dataclips-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": darkBackground,
          "editor.lineHighlightBackground": darkLineHighlightBackground,
        },
      });
    },
    [
      lightBackground,
      lightLineHighlightBackground,
      darkBackground,
      darkLineHighlightBackground,
    ]
  );

  // 监听保存按键，格式化 sql 语句
  useEffect(() => {
    const handleSqlFormat = (e) => {
      const formatValue = () => {
        e.preventDefault();

        onChange(format((document.activeElement as HTMLTextAreaElement).value));
      };

      // 焦点建立在 TextArea 的情况下
      if (document.activeElement.tagName === "TEXTAREA") {
        // MAC 平台
        if (window.navigator.platform.match("Mac")) {
          if (e.metaKey && e.code === "KeyS") {
            formatValue();
          }
          // 其他平台
        } else {
          if (e.ctrlKey && e.code === "KeyS") {
            formatValue();
          }
        }
      }
    };

    window.addEventListener("keydown", handleSqlFormat);

    return () => {
      window.removeEventListener("keydown", handleSqlFormat);
    };
  }, [onChange]);

  return (
    <Box h="200px">
      <Editor
        height="100%"
        theme={theme}
        defaultLanguage="sql"
        options={{
          contextmenu: false,
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
