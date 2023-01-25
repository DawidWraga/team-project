import { anyQuery } from 'lib-client/controllers/types/Controller';
import { z } from 'zod';

// interface IQueryConfig<TModel, TInput extends  z.ZodType<any, any, any>> {
//   input: TInput;
//   queryFn: (prismaOptions: z.infer<TInput>) => Promise<any>;
//   guard: (requestData: any) => string | void;
//   // formatPrismaOptions: (prismaProps: anyObj) => anyObj;
//   logDataBeforeQuery: boolean;
// }

// type IConfigCreator = <TModel,TInput extends z.ZodType<any, any, any>>(
//   props: {

//     input: ()=>TInput;
//     queryFn: (options: TInput) => any;
//   }
// ) => IQueryConfig<TModel,TInput>;

// type IQueryConfig<TModel, TInput extends z.ZodType<any, any, any>> = () => {
//   input: TInput;
//   queryFn: (prismaOptions: z.infer<TInput>) => number;
// };

// type IPartialQueryConfigs<TModel> = Partial<
//   Record<anyQuery | 'default', IQueryConfig<TModel, any>>
// >;

// const configs: IPartialQueryConfigs<{ a: string; b: number }> = {
//   create: <any>() => ({
//     input: z.string(),
//     queryFn(options) {
//       options;
//       return 1;
//     },
//   }),
// };
