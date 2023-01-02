import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Progress() {
	const router = useRouter();

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		const start = () => {
			timeout = setTimeout(NProgress.start, 100);
		};

		const done = (ev) => {
			clearTimeout(timeout);
			NProgress.done();
			// console.log('done', ev);
		};

		router.events.on('routeChangeStart', start);
		router.events.on('routeChangeComplete', done);
		router.events.on('routeChangeError', done);
		return () => {
			router.events.off('routeChangeStart', start);
			router.events.off('routeChangeComplete', done);
			router.events.off('routeChangeError', done);
		};
	}, []);
	return <></>;
}
