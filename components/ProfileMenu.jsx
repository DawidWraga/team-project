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
import { isMobile } from 'utils/checkScreenWidth';
import { signOut } from '../controllers/auth';
import { useRouter } from 'next/router';

export default function ProfileMenu(props) {
	const {} = props;
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
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
				<MenuItem icon={<BsPersonCircle fontSize="1.25rem" />} onClick={onOpen}>
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
	);
}
