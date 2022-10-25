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

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);

			const user = getCurrentUser();
			if (!user) {
				router.replace('/auth');
				await setTimeoutPromise(200);
			}
			setLoading(false);
		})();
	}, []);

	if (loading) return <div>loading...</div>;

	return (
		<>
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
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}

export default MyApp;
