import { FC } from "react";
import { marked } from "marked";
import { Box } from "@chakra-ui/react";

export interface MarkdownConfig {
  content: string;
}

export const Markdown: FC<MarkdownConfig> = ({ content }) => {
  console.log(" marked.parse(content)", marked.parse(content));
  return (
    <Box
      sx={{
        "> *": {
          all: "revert",
        },
      }}
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
};
