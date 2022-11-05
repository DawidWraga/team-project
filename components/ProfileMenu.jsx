import {
	Avatar,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
} from '@chakra-ui/react';
import { MdGroupAdd } from 'react-icons/md';
import { BsPersonCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { signOut } from '../controllers/auth';
import { useRouter } from 'next/router';
import UserModal from 'components/UserModal';
import InviteTeamModal from './InviteTeamModal';

export default function ProfileMenu(props) {
	const {} = props;
	const router = useRouter();
	const {
		isOpen: userModalIsOpen,
		onOpen: userModalOnOpen,
		onClose: userModalOnClose,
	} = useDisclosure();
	const {
		isOpen: inviteTeamIsOpen,
		onOpen: inviteTeamOnOpen,
		onClose: inviteTeamOnClose,
	} = useDisclosure();

	return (
		<>
			<UserModal isOpen={userModalIsOpen} onClose={userModalOnClose} />
			<InviteTeamModal isOpen={inviteTeamIsOpen} onClose={inviteTeamOnClose} />
			<Menu
				// placement={isMobile() ? 'bottom-left' : 'right'}
				colorScheme="blue"
				// offset={[0, 10]}
				{...props}
			>
				<MenuButton
					_hover={{ cursor: 'pointer' }}
					as={Avatar}
					aria-label="Options"
					// icon={<BsThreeDotsVertical color="white" />}
					variant="link"
					w={{ base: '32px', lg: '42px' }}
					h={{ base: '32px', lg: '42px' }}
				/>
				<MenuList color="gray">
					<MenuItem
						icon={<BsPersonCircle fontSize="1.25rem" />}
						onClick={userModalOnOpen}
					>
						View Profile
					</MenuItem>
					<MenuItem
						icon={<MdGroupAdd fontSize="1.25rem" />}
						onClick={inviteTeamOnOpen}
					>
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
		</>
	);
}
