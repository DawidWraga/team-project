import { ToastContainer } from 'react-toastify';
import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'styles/chakra-theme';
import 'styles/nprogress.css';
import NProgress from '../components/nprogress';
import Head from 'next/head';
import Loading from 'components/loading';
import MainLayout from 'components/layout/MainLayout';
import { GlobalContextProvider } from 'contexts/GlobalContext';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	// ======CHECK AUTH STATE; REDIRECT IF NOT AUTHENTICATED======

	// function AuthGuard() {
	// }
	const [loading, setLoading] = useState(false);

	// AUTH CHECK TOP ONE SHOULD BE  WORKING
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
			<ChakraProvider theme={theme}>
				<GlobalContextProvider>
					{loading ? (
						<Loading />
					) : (
						// getLayout(<Component {...pageProps} />)
						<MainLayout>
							<Component {...pageProps} />
						</MainLayout>
					)}
				</GlobalContextProvider>
			</ChakraProvider>
			<Analytics />
		</>
	);
}

export default MyApp;
