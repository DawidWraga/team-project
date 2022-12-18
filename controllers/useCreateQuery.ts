import { AxiosRequestConfig } from 'axios';
import { ICustomFetcher } from 'controllers/createController';
import { useRouter } from 'next/router';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';

export interface IUseCreateQueryProps<
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
	fetcherConfig?: AxiosRequestConfig<any>;
	queryFn: ICustomFetcher;
	passQuery?: boolean;
}

export const useCreateQuery = <
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
>(
	options: IUseCreateQueryProps<TQueryFnData, TError, TData, TQueryKey>
) => {
	const { queryFn, fetcherConfig, passQuery, ..._options } = options;

	const { query } = useRouter();

	const defaultOptions: any = {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	};

	if (passQuery && fetcherConfig) fetcherConfig.params = query;

	if (queryFn && fetcherConfig)
		defaultOptions.queryFn = () => queryFn(fetcherConfig);

	return useQuery<TQueryFnData, TError>({
		...defaultOptions,
		..._options,
	});
};
