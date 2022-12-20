import { ToastContainer } from 'react-toastify';
import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'styles/chakra-theme';
import 'styles/nprogress.css';
import NProgress from '../components/nprogress';
import Head from 'next/head';
import Loading from 'components/loading';
import MainLayout from 'components/layout/MainLayout';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  // const queryClient = new QueryClient();

  // ======CHECK AUTH STATE; REDIRECT IF NOT AUTHENTICATED======

  // function AuthGuard() {
  // }
  const [loading, setLoading] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    window.scrollTo(0, 1);
    (async () => {
      setLoading(true);

      const isSignedIn = await getCurrentUser();
      if (!isSignedIn && router.asPath !== '/register') {
        router.replace('/auth');
        await setTimeoutPromise(200);
      }

      if (isSignedIn && router.pathname === '/') {
        router.replace('/dashboard');
      }

      setLoading(false);
    })();
  }, []);

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
      <Suspense fallback="loading...">
        <ChakraProvider theme={theme}>
          {loading ? (
            <Loading />
          ) : (
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
                <ReactQueryDevtools initialIsOpen={false} />
              </Hydrate>
            </QueryClientProvider>
          )}
        </ChakraProvider>
      </Suspense>
    </>
  );
}

export default MyApp;

{
  /* // getLayout(<Component {...pageProps} />) */
}
