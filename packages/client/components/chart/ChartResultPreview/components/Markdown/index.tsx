import { FC } from "react";
import { marked } from "marked";
import { Box } from "@chakra-ui/react";
import "github-markdown-css";

export interface MarkdownConfig {
  content: string;
}

export const Markdown: FC<MarkdownConfig> = ({ content }) => {
  return (
    <Box
      className="markdown-body"
      sx={{
        "> *": {
          all: "revert",
        },
      }}
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
};
