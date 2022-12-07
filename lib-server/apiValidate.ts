import { NextApiRequest, NextApiResponse } from 'next';
import { ZodObject } from 'zod';

type NextHandler = (err?: Error) => void;

export const apiValidate = <TSchema extends ZodObject<any>>(
  schema: TSchema,
  mode: 'body' | 'query' | 'headers' = 'body'
) => {
  return async (req: NextApiRequest, res: NextApiResponse, next?: NextHandler) => {
    try {
      schema.parse(req[mode]);

      if (Boolean(next)) return next();

      res.status(404).end();
    } catch (error) {
      res.status(400).send(error);
    }
  };
};
