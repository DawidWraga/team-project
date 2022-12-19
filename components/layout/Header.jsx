import { Flex, Icon, IconButton, Box } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen, MdSearch } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import { MobileOnly } from '../deviceTypes';
import ProfileMenu from '../ProfileMenu';
import { useLayoutStore } from 'stores/LayoutStore';
import HeaderContent from './HeaderContent';

export default function Header(props) {
  const {} = props;
  const { sideNavIsOpen, setSideNavIsOpen } = useLayoutStore();

  return (
    <>
      <Box h="60px" w="500px" position="fixed" top={0} left={0} bgColor="shade.main" />
      <Flex
        w="100%"
        h="60px"
        bgColor="shade.main"
        position="fixed"
        top="0"
        ml={{ lg: sideNavIsOpen ? '200px' : '0' }}
        transition="all 150ms"
        alignItems="center"
        zIndex={'banner'}
      >
        <IconButton
          variant={'unstyled'}
          onClick={() => setSideNavIsOpen((prev) => !prev)}
        >
          <Icon
            as={sideNavIsOpen && !isMobile() ? MdMenuOpen : MdMenu}
            color="white"
            w={'100%'}
            fontSize="1.7rem"
          />
        </IconButton>
        <HeaderContent />
        <Flex position="fixed" right="2" top={{ base: 4, lg: '3' }} gap="3" zIndex="999">
          <IconButton
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
          <ProfileMenu offset={[4, 11]} />
        </Flex>

        {/* POSSIBL ADDITION: FILTER BAR UNDER HEADER WITH TAG STYLINING */}
        {/* <Flex
					position="absolute"
					left="0"
					top="60px"
					w="100%"
					h="45px"
					bgColor="shade.light"
					zIndex="10000"
				></Flex> */}
      </Flex>
    </>
  );
}

// function HeaderContent() {
// 	if (!activePage?.parentLink.route) return <>no route</>;

// 	const DynamicComponent = lazy(() =>
// 		import(`components/layout/headerContent${activePage.route}`).catch(
// 			() => ({
// 				default: () => <></>,
// 			})
// 		)
// 	);

// 	return (
// 		<Suspense fallback={<></>}>
// 			<DynamicComponent {...props} />
// 		</Suspense>
// 	);
// }
