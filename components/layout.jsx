import { useState } from 'react';
import { ScreenDependent } from './deviceTypes';
import { TbMenu } from 'react-icons/tb';
import { MdClose } from 'react-icons/md';
import { SignOutBtn } from './SignOutBtn';
import SideNavContent from 'components/SideNavContent';
import { useRouter } from 'next/router';

export default function Layout(props) {
	const { children } = props;
	const router = useRouter();

	if (router.pathname === '/auth') return <>{children}</>;

	const headerClasses = '';

	const Desktop = () => (
		<>
			<aside className={`fixed top-0 w-[175px] h-screen bg-secondary-main `}>
				<SideNavContent />
			</aside>
			<header
				className={`fixed top-0 w-[calc(100vw_-_175px)] ml-[175px] h-[52px] bg-secondary-main text-secondary-contrast flex items-center px-2`}
			>
				header
			</header>
		</>
	);

	const Mobile = () => {
		const [sideNavIsOpen, setSideNavIsOpen] = useState(false);

		return (
			<>
				<aside
					className={`
          ${sideNavIsOpen ? '-translate-x-0' : '-translate-x-[500px]'}
          
          w-[clamp(200px,60vw,300px)]
          fixed top-0  h-screen bg-secondary-main transition-all duraton-300 z-50`}
				>
					<button
						className="absolute right-2 top-2 z-50"
						onClick={() => setSideNavIsOpen(false)}
					>
						<MdClose fontSize={'1.5rem'} color="white" />
					</button>
					<SideNavContent />
				</aside>
				<div
					onClick={() => setSideNavIsOpen(false)}
					className={`bg-slate-800  fixed w-screen h-screen z-30
        trasnition duration-300 hover:cursor-pointer
        ${sideNavIsOpen ? 'opacity-70' : 'opacity-0'}`}
				></div>
				<header
					className={`fixed top-0 w-screen h-[52px] bg-secondary-main z-40 flex flex-row items-center space-x-1 px-1 text-secondary-contrast`}
				>
					<button onClick={() => setSideNavIsOpen(true)} className="h-full">
						<TbMenu size="32px" color="fff" />
					</button>
					<h2>header</h2>
				</header>
			</>
		);
	};

	return (
		<>
			<ScreenDependent Mobile={Mobile} Desktop={Desktop} />
			<div className="w-screen top-[52px] fixed lg:w-[calc(100vw_-_175px)] lg:left-[175px] ">
				{children}
			</div>
		</>
	);
}
