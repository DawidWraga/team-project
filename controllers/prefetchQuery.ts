import { AxiosRequestConfig } from 'axios';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
export const prefetchQuery =
  (
    identifier: string | string[],
    fetcher: (config?: AxiosRequestConfig<any>) => Promise<any>
  ) =>
  async (ctx: NextPageContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(identifier, () => fetcher({ params: ctx.query }));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  };
