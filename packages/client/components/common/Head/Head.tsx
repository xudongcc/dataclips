import NextHead from "next/head";
import React, { FC } from "react";

export interface HeadProps {
  title: string;
}

export const Head: FC<HeadProps> = (props) => {
  return (
    <NextHead>
      <link rel="icon" href="/icons/icon-32x32.png" type="image/png" />

      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="/icons/icon-512x512.png"
      />

      <title>{props.title}</title>
    </NextHead>
  );
};
