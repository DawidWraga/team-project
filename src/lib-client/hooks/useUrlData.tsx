import { useRouter } from 'next/router';
import { useMemo } from 'react';


const isNumeric = (n: any) => !isNaN(n);

export function useUrlData<T extends { [key: string]: string | number }>(
  type: 'dynamicPath' | 'queryParams' = 'queryParams'
): T | undefined {
  const router = useRouter();
  const value = useMemo(() => {
    const queryParamsStr = router.asPath.split('?').slice(1).join('');
    const urlSearchParams = new URLSearchParams(queryParamsStr);
    // the first key might be in the shape "/assets?foobar", we must change to "foobar"
    const params = Object.fromEntries(urlSearchParams.entries());

    let query = router.query;
    if (type === 'dynamicPath') {
      if (!query) return;

      query = Object.fromEntries(
        Object.entries(query)
          .filter(([k, v]) => !params[k])
          .map(([k, v]) => (isNumeric(v) ? [k, Number(v)] : [k, v]))
      );
    }

    return type === 'dynamicPath' ? query : (params as T | undefined);
  }, [router.asPath]);

  return value as any;
}
