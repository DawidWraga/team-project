//@ts.ignore
import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useState } from 'react';
import { theme } from 'styles/chakra-theme';
import 'styles/nprogress.css';
import NProgress from '../components/nprogress';
import Head from 'next/head';
import MainLayout from 'layouts/MainLayout';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { MainModal } from 'components/MainModal';
import { useSyncPageToRoute } from 'lib-client/hooks/useSyncPageToRoute';
import { EmptyState, ErrorBoundary, ModalsProvider, SaasProvider } from '@saas-ui/react';
import NextLink from 'next/link';
import { Loading } from '@saas-ui/react';
import { SessionProvider } from 'next-auth/react';
import { CustomToastProvider } from 'components/CustomToastProvider';
import AuthGuard from 'components/AuthGuard';
import '@tremor/react/dist/esm/tremor.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const [queryClient] = useState(() => new QueryClient());
  useSyncPageToRoute();
  // const isHydrated = useIsHydrated();

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-icon" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NProgress />
      <CustomToastProvider />

      <SessionProvider session={session}>
        <SaasProvider
          theme={theme}
          linkComponent={Link}
          onError={(error) => {
            console.error(error);
          }}
        >
          <ErrorBoundary
            errorComponent={
              <EmptyState title="Thank you for your patience while we fix this small bug." />
            }
          >
            <ModalsProvider>
              <Suspense fallback={<Loading />}>
                <QueryClientProvider client={queryClient}>
                  <Hydrate state={pageProps.dehydratedState}>
                    <AuthGuard>
                      <MainLayout>
                        <Component {...pageProps} />
                      </MainLayout>
                    </AuthGuard>

                    <MainModal />
                    <ReactQueryDevtools initialIsOpen={false} />
                  </Hydrate>
                </QueryClientProvider>
              </Suspense>
            </ModalsProvider>
          </ErrorBoundary>
        </SaasProvider>
      </SessionProvider>
    </>
  );
}

const Link = (props: any) => {
  return <NextLink {...props} />;
};
