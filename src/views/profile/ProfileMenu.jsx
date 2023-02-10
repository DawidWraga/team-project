import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { MdGroupAdd } from 'react-icons/md';
import { BsPersonCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserModal from 'views/profile/UserModal';
import InviteTeamModal from 'components/InviteTeamModal';

export default function ProfileMenu(...props) {
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
          position="absolute"
          bottom="0"
          h="70px"
          w="100%"
          bgColor="shade.main"
          _hover={{
            bgColor: 'shade.min',
            cursor: 'pointer',
          }}
          // alignItems={'center'}
          display="flex"
          gap={1}
          px={1}
          color="white"
          aria-label="Options"
          flexDir={'row'}
          overflow={'visible'}
          mb="2"
        >
          <Flex gap="2">
            <Avatar />
            <Flex flexDir="column" alignItems="start">
              <Text>Name</Text>
              <Text>Johnsmith@gmail.com</Text>
            </Flex>
          </Flex>
        </MenuButton>
        <MenuList color="gray">
          <MenuItem
            icon={<BsPersonCircle fontSize="1.25rem" />}
            onClick={userModalOnOpen}
          >
            View Profile
          </MenuItem>
          <MenuItem icon={<MdGroupAdd fontSize="1.25rem" />} onClick={inviteTeamOnOpen}>
            Invite team
          </MenuItem>
          <MenuItem
            icon={<FiLogOut fontSize="1.25rem" className="rotate-180" />}
            onClick={() => {
              // custom implementation of redirecting to prevent page refresh
              signOut({ redirect: false, callbackUrl: '/auth' }).then(({ url }) => {
                router.replace(url);
              });
            }}
          >
            sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
