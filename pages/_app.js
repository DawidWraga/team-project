import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut } from '/controllers/auth';
import { toast } from 'react-toastify';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import Layout from '../components/layout';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'styles/chakra-theme';
import 'styles/nprogress.css';
import NProgress from '../components/nprogress';
import Head from 'next/head';
import Loading from 'components/loading';
import { AnimateSharedLayout } from 'framer-motion';

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	// ======CHECK AUTH STATE; REDIRECT IF NOT AUTHENTICATED======

	// function AuthGuard() {
	// }
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		window.scrollTo(0, 1);
		(async () => {
			setLoading(true);

			const user = await getCurrentUser();
			if (!user) {
				router.replace('/auth');
				await setTimeoutPromise(200);
			}
			setLoading(false);
		})();
	}, []);
	// if (loading) return ;

	// const user = getCurrentUser();
	// if (isBrowser() && router.pathname !== '/auth' && !user)
	// 	router.replace('/auth');

	return (
		<>
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
				{loading ? (
					<Loading />
				) : (
					<Layout>
						<Component {...pageProps} />
					</Layout>
				)}
			</ChakraProvider>
			<NProgress />
		</>
	);
}

export default MyApp;
