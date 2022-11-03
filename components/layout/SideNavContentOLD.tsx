import InviteTeamModal from 'components/InviteTeamModal';
import pages from 'db/pages.json';
import { useRouter } from 'next/router';
import { routeToIconMap } from 'constants/routeToIconMap';

import { getCurrentUser, signOut } from 'controllers/auth';
import { MdGroupAdd } from 'react-icons/md';
import {
	Flex,
	Avatar,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Box,
	useDisclosure,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Logo } from 'components/Logo';

interface IProps {
	setSideNavIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideNavContent(props: IProps) {
	const { setSideNavIsOpen } = props;
	const router = useRouter();
	const user = getCurrentUser();

	const { isOpen, onOpen, onClose } = useDisclosure();

	function Footer() {
		return (
			<>
				<InviteTeamModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
				<Flex
					h="52px"
					textColor={'white'}
					gap="2"
					p="1"
					justifyContent={'start'}
					alignItems="center"
					sx={{ position: 'relative', bottom: { base: '100px', lg: 0 } }}
				>
					<Avatar size="sm" />
					<Flex alignContent="center" flexDir={'column'}>
						<Text fontSize={'sm'}>{user.name}</Text>
						<Text fontSize={'xs'}>{user.email}</Text>
					</Flex>
					<Box position="absolute" right="0">

					</Box>
				</Flex>
			</>
		);
	}

	return (
		<div className="flex flex-col relative h-full ">
			<Flex
				as="header"
				className=" hover:cursor-pointer h-[52px] items-center justify-center text-secondary-contrast"
				// onClick={() => router.push('/')}
			>
				<Logo headingSize="md" logoSize="2rem" headingColor="white" />
			</Flex>
			<nav className="grow">
				{pages.map(({ label, route }) => {
					const isActive = router.pathname === route;

					return (
						<div
							key={route}
							className={`w-full px-3 py-1 gap-3 flex justify-start items-center hover:cursor-pointer transition hover:bg-secondary-light text-secondary-contrast relative ${
								isActive ? 'font-semibold' : ''
							}`}
							onClick={() => {
								setSideNavIsOpen && setSideNavIsOpen(false);
								router.push(route);
							}}
						>
							{isActive && (
								<Box
									as={motion.div}
									layoutId="highlight"
									initial={{ backgroundColor: 'none' }}
									exit={{ backgroundColor: 'none' }}
									animate={{
										backgroundColor: 'rgb(255, 152, 0)',
										transition: {
											type: 'spring',
											stiffness: 500,
											damping: 30,
										},
									}}
									className="w-1 h-full rounded-full absolute left-0 block"
								></Box>
							)}
							<div className="inline-block">{routeToIconMap[route]}</div>
							<span className="text-[1.25rem] lg:text-[1.05rem]">{label}</span>
						</div>
					);
				})}
			</nav>
			<Footer />
		</div>
	);
}
