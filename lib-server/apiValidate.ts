import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodAny, ZodObject } from 'zod';

// import { createResolver } from './validation';
// import type { SCHEMA_TYPE } from './validation';

type NextHandler = (err?: Error) => void;

interface IValidationProps<TSchema> {
  schema: TSchema;
  mode: 'body' | 'query' | 'headers';
}

export const apiValidate = <TSchema extends ZodObject<any>>({
  schema,
  mode = 'body',
}: IValidationProps<TSchema>) => {
  return (handler?: (req: NextApiRequest, res: NextApiResponse<any>) => any) =>
    async (req: NextApiRequest, res: NextApiResponse, next?: NextHandler) => {
      try {
        const result = schema.parse(req[mode]);

        if (!!next) {
          return next();
        }

        if (handler) return handler(req, res);

        res.status(404).end();
      } catch (error) {
        res.status(400).send(error);
      }
    };
};
// export function withValidations(validations: ValidationHoF[]) {
//   return (handler?: (req: NextApiRequest, res: NextApiResponse<any>) => any) => {
//     return async (req: NextApiRequest, res: NextApiResponse, next?: NextHandler) => {
//       try {
//         validations.forEach((validation) => {
//           const resolver = createResolver(validation.type, validation.schema);
//           resolver.validate(req[validation.mode || 'query']);
//         });

//         if (!!next) {
//           return next();
//         }

//         if (handler) return handler(req, res);

//         res.status(404).end();
//       } catch (error) {
//         res.status(400).send(error);
//       }
//     };
//   };
// }
