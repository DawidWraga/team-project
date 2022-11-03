import {
	Avatar,
	Box,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
} from '@chakra-ui/react';
import pages from 'db/pages.json';
import { useRouter } from 'next/router';
import { DesktopOnly } from '../deviceTypes';
import NavIcon from './NavIcon';
import { LogoIcon } from 'components/Logo';
import { IoMdSettings } from 'react-icons/io';
import { MdGroupAdd } from 'react-icons/md';
import { BsPersonCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';

export default function PageIcons(props) {
	const {} = props;
	const router = useRouter();

	const activePage =
		pages.find((page) => router.pathname.includes(page.route)) || 'home';

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Flex
			position="fixed"
			h={{ base: '60px', lg: '100%' }}
			w={{ base: '100vw', lg: '60px' }}
			justifyContent={{ base: 'stretch', lg: 'center' }}
			alignContent="center"
			alignItems="center"
			flexDir={{ base: 'row', lg: 'column' }}
			bgColor={'shade.main'}
			bottom={0}
			top={{ lg: 0 }}
			zIndex="overlay"
			py={{ lg: 2 }}
		>
			<DesktopOnly mb="30px">
				<LogoIcon fontSize="2.7rem" />
			</DesktopOnly>

			{pages.map((page) => {
				return (
					<NavIcon
						key={page.route}
						route={page.route}
						label={page.label}
						isActive={activePage?.route?.includes(page.route)}
					/>
				);
			})}
			<DesktopOnly
				display={{ base: 'none', lg: 'inline-flex' }}
				mt="auto"
				flexDir="column"
				gap="2"
			>
				{/* <Avatar size="sm"></Avatar> */}

				<Menu placement="right" colorScheme="blue" offset={[0, 10]}>
					<MenuButton
						_hover={{ cursor: 'pointer' }}
						as={Avatar}
						aria-label="Options"
						// icon={<BsThreeDotsVertical color="white" />}
						variant="link"
						w="42px"
						h="42px"
					/>
					<MenuList color="gray">
						<MenuItem
							icon={<BsPersonCircle fontSize="1.25rem" />}
							onClick={onOpen}
						>
							View Profile
						</MenuItem>
						<MenuItem icon={<MdGroupAdd fontSize="1.25rem" />} onClick={onOpen}>
							Invite team
						</MenuItem>
						<MenuItem
							icon={<FiLogOut fontSize="1.25rem" className="rotate-180" />}
							onClick={() => {
								signOut();
								router.replace('/auth');
							}}
						>
							sign out
						</MenuItem>
					</MenuList>
				</Menu>
			</DesktopOnly>
		</Flex>
	);
}
