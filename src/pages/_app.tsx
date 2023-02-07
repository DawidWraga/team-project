import { ToastContainer } from 'react-toastify';
import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { Suspense, useState } from 'react';
import { theme } from 'styles/chakra-theme';
import 'styles/nprogress.css';
import NProgress from '../components/nprogress';
import Head from 'next/head';
import MainLayout from 'layouts/MainLayout';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { MainModal } from 'components/MainModal';
import { useAuthGuard } from 'lib-client/hooks/useAuthGuard';
import { useSyncPageToRoute } from 'lib-client/hooks/useSyncPageToRoute';
import { SaasProvider } from '@saas-ui/react';
import NextLink from 'next/link';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { Loading } from '@saas-ui/react';

const Link = (props) => {
  return <NextLink {...props} />;
};

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const { loading } = useAuthGuard();
  useSyncPageToRoute();
  const isHydrated = useIsHydrated();

  return (
    <>
      <NProgress />
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <SaasProvider theme={theme} linkComponent={Link}>
        <Suspense fallback={<Loading />}>
          {/* {loading || !isHydrated ? ( */}
          {loading ? (
            <Loading />
          ) : (
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
                <MainModal />
                <ReactQueryDevtools initialIsOpen={false} />
              </Hydrate>
            </QueryClientProvider>
          )}
        </Suspense>
      </SaasProvider>
    </>
  );
}

export default MyApp;
