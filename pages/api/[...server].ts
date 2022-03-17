import { NextApiRequest, NextApiResponse } from "next";

import { createNestApp } from "../../dist/createNestApp";

const app = createNestApp();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  (await app).getHttpAdapter().getInstance()(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
