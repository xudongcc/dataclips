import { FC } from "react";
import { marked } from "marked";
import { Box } from "@chakra-ui/react";
import "github-markdown-css";
import styled from "styled-components";

const Wrapper = styled.div`
  & > *: {
    all: revert;
  }
  overflow: hidden scroll;
  height: 100%;
`;

export interface MarkdownConfig {
  content: string;
}

export const Markdown: FC<MarkdownConfig> = ({ content }) => {
  return (
    <Wrapper
      className="markdown-body"
      dangerouslySetInnerHTML={{
        __html: marked.parse(content || ""),
      }}
    />
  );
};
