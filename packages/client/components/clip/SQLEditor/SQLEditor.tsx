import Editor, { loader } from "@monaco-editor/react";
import { FC, useCallback, useContext, useEffect, useRef } from "react";
import { format } from "sql-formatter";
import { SystemThemeContext } from "../../../context";

loader.config({
  paths: { vs: "/editor" },
});

export interface SQLEditorProps {
  value: string;
  formatType?: "mysql" | "postgresql";
  onChange: (value: string) => void;
}

export const SQLEditor: FC<SQLEditorProps> = ({
  value,
  onChange,
  formatType = "mysql",
}) => {
  const editorRef = useRef(null);

  const systemTheme = useContext(SystemThemeContext);

  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue || "");
    },
    [onChange]
  );

  const handleBeforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#fff",
        "editor.lineHighlightBackground": "#fff",
      },
    });

    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1d1d1d",
        "editor.lineHighlightBackground": "#1d1d1d",
      },
    });
  }, []);

  // 监听保存按键，格式化 sql 语句
  useEffect(() => {
    const handleSqlFormat = (e) => {
      const formatValue = () => {
        e.preventDefault();

        onChange(
          format(editorRef.current?.getValue(), { language: formatType })
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatType]);

  return (
    <div style={{ height: 250 }}>
      <Editor
        height="100%"
        theme={systemTheme}
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
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        beforeMount={handleBeforeMount}
      />
    </div>
  );
};
