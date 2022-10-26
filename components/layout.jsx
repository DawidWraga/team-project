import { useState } from 'react';
import { ScreenDependent } from './deviceTypes';
import { TbMenu } from 'react-icons/tb';
import { MdClose, MdMenu } from 'react-icons/md';
import SideNavContent from 'components/SideNavContent';
import { useRouter } from 'next/router';
import { Flex, Icon, IconButton, Box } from '@chakra-ui/react';

export default function Layout(props) {
	const { children } = props;
	const router = useRouter();

	// hide layout on auth page
	if (router.pathname === '/auth') return <>{children}</>;

	const Desktop = () => (
		<>
			<Box
				as="aside"
				bgColor="shade.main"
				className={`fixed top-0 w-[175px] h-screen `}
			>
				<SideNavContent />
			</Box>
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
				<Box
					as="aside"
					bgColor={'shade.main'}
					className={`
          ${sideNavIsOpen ? '-translate-x-0' : '-translate-x-[500px]'}
          
          w-[clamp(200px,60vw,300px)]
          fixed top-0  h-screen  transition-all duraton-300 z-50`}
				>
					<button
						className="absolute right-2 top-2 z-50"
						onClick={() => setSideNavIsOpen(false)}
					>
						<MdClose fontSize={'1.5rem'} color="gray" />
					</button>
					<SideNavContent />
				</Box>
				<div
					onClick={() => setSideNavIsOpen(false)}
					className={`bg-slate-800  fixed w-screen h-screen z-30
        transition duration-300 backdrop-blur-lg
        ${sideNavIsOpen ? 'opacity-70' : 'opacity-0'}`}
				></div>
				<Flex
					as="header"
					position="fixed"
					top="0"
					w="100vw"
					bgColor={'shade.main'}
					zIndex="40"
					justifyContent={'start'}
					alignItems="center"
					h="52px"
					gap="2"
					px="1"
					textColor="shade.inv"
				>
					<IconButton
						variant={'unstyled'}
						onClick={() => setSideNavIsOpen(true)}
					>
						<MdMenu color="white" fontSize="2rem" />
					</IconButton>
					<h2>header</h2>
				</Flex>
				{/* <header
					className={`fixed top-0 w-screen h-[52px] bg-secondary-main z-40 flex flex-row items-center space-x-1 px-1 text-secondary-contrast`}
				>
				</header> */}
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
