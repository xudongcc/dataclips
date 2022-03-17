import { FC } from "react";
import { NextPage } from "next";

export type PageComponent<P = {}> = NextPage<P> & {
  layout?: FC;
};

export type PC<P = {}> = PageComponent<P>;
