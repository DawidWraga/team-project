import { AxiosRequestConfig } from 'axios';
import { QUERY_STALE_TIME, queryClient } from 'lib-client/constants';
import { NextPageContext } from 'next';
import { dehydrate } from 'react-query';

export const prefetchQuery =
  (
    identifier: string | string[],
    fetcher: (config?: AxiosRequestConfig<any>) => Promise<any>
  ) =>
  async (ctx: NextPageContext) => {
    await queryClient.prefetchQuery(identifier, () => fetcher({ params: ctx.query }), {
      staleTime: QUERY_STALE_TIME,
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  };
