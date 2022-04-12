import { theme as baseTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme(
  {
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
    colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
    styles: {
      global: () => ({
        // 去除 chakra 的 focus 样式
        '[class^="chakra"][data-focus], [class^="chakra"]:focus': {
          boxShadow: "none !important",
        },
        "html, body": {
          height: "100%",
        },
        "#root": {
          height: "full",
        },
      }),
    },
  },
  baseTheme
);
