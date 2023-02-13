import { controller } from 'lib-client/controllers';
import {
  GetPrismaModelType,
  ICustomUseMutationOptions,
  ICustomUseQueryOptions,
  anyQuery,
  readQuery,
} from 'lib-client/controllers/types/Controller';
import { PrismaModelNames } from 'lib-server/prisma';

export function ControllerWrapper<
  TQuery extends anyQuery = anyQuery,
  TModelName extends PrismaModelNames = PrismaModelNames,
  TData = GetPrismaModelType<TModelName>,
  TOptions = TQuery extends readQuery
    ? ICustomUseQueryOptions<TData>
    : ICustomUseMutationOptions<TData>
>({
  children,
  ...props
}: {
  children: (props: any) => JSX.Element;
  query: TQuery;
  model: TModelName;
} & TOptions) {
  const controllerReturn = controller.use(props);
  return children(controllerReturn);
}
