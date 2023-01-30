import { Flex, Icon, IconButton, Box } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen, MdSearch } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import ProfileMenu from 'views/profile/ProfileMenu';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useEffect } from 'react';
import OptionBar from 'layouts/OptionBar';
import { headerHeight } from 'lib-client/constants';
import dynamic from 'next/dynamic';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
const HeaderContent = dynamic(() => import('layouts/HeaderContent'), {
  ssr: false,
});

export default function Header(props) {
  const {} = props;
  const { sideNavIsOpen, toggleSideNavIsOpen, setSideNavIsOpen, activePage, leftOffset } =
    useLayoutStore();

  // const sideNavLinks = activePage?.sideNavLinks;
  // useEffect(() => {
  //   if (!sideNavLinks) setSideNavIsOpen(false);
  // }, [sideNavLinks]);

  const isHydrated = useIsHydrated();

  return (
    <>
      <Box h="60px" w="500px" position="fixed" top={0} left={0} bgColor="shade.main" />
      <Flex
        w="100%"
        h={headerHeight + 'px'}
        bgColor="shade.main"
        position="fixed"
        top="0"
        ml={leftOffset}
        transition="all 150ms"
        alignItems="center"
        zIndex={'banner'}
      >
        {isHydrated && (
          <IconButton
            variant={'unstyled'}
            aria-label="toggle side nav"
            onClick={toggleSideNavIsOpen}
          >
            <Icon
              as={sideNavIsOpen && !isMobile() ? MdMenuOpen : MdMenu}
              color="white"
              w={'100%'}
              fontSize="1.7rem"
            />
          </IconButton>
        )}
        <HeaderContent />
        <Flex position="fixed" right="2" top={{ base: 4, lg: '3' }} gap="3" zIndex="999">
          <IconButton
            aria-label="search"
            variant="unstyled"
            rounded="full"
            borderColor="white"
            borderWidth="0px"
            display={{ base: 'none', lg: 'inline-block' }}
            _hover={{
              cursor: 'pointer',
              borderWidth: '1px',
              minW: '200px',
            }}
            px="5"
            transition="all 400ms"
            position="relative"
          >
            <Icon
              color="white"
              fontSize="2rem"
              as={MdSearch}
              position="absolute"
              left="2"
              top="1.5"
            />
          </IconButton>
        </Flex>
      </Flex>
      <OptionBar />
    </>
  );
}
