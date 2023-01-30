import { Avatar, Box, Flex, Icon, Text, forwardRef } from '@chakra-ui/react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { MdClose } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ProfileMenu from 'views/profile/ProfileMenu';
const SideNavContent = dynamic(() => import('layouts/SideNavContent'), {
  ssr: false,
});

export default function SideNav(props) {
  const {} = props;

  const { sideNavIsOpen, setSideNavIsOpen } = useLayoutStore();

  return (
    <>
      <Box
        h="100vh"
        w={{ base: 'clamp(250px,75vw,350px)', lg: '250px' }}
        position="fixed"
        bgColor="shade.main"
        left={{
          base: sideNavIsOpen ? '0' : '-350px',
          lg: sideNavIsOpen ? '0' : '-250px',
        }}
        top="0"
        zIndex={{ base: 'popover', lg: 'sticky' }}
        transition="all 150ms"
        sx={{ '& > .chakra-text, & > p': { textColor: 'shade.inv' } }}
      >
        <Icon
          position="absolute"
          right="2"
          top="2"
          zIndex="50"
          display={{ base: 'inline-box', lg: 'none' }}
          onClick={() => setSideNavIsOpen(false)}
          _hover={{ cursor: 'pointer' }}
          as={MdClose}
          fontSize={'1.5rem'}
          color="gray.100"
        />
        <SideNavContent />
        <ProfileMenu offset={[22, 22]} />
      </Box>
      <AnimatePresence>
        {sideNavIsOpen && isMobile() && (
          <Box
            as={motion.div}
            w="100vw"
            h="100vh"
            top="0"
            bgColor={'blackAlpha.900'}
            zIndex="overlay"
            position="fixed"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0.5, backdropFilter: 'blur(5px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition="opacity 100ms"
            onClick={() => setSideNavIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProfileSection(props: any) {
  return (
    <Flex
      position="absolute"
      bottom="0"
      h="70px"
      w="100%"
      bgColor="shade.main"
      _hover={{
        bgColor: 'shade.min',
        cursor: 'pointer',
      }}
      alignItems={'center'}
      gap={1}
      px={1}
      color="white"
    >
      <Avatar />
      <Flex flexDir="column">
        <Text>Name</Text>
        <Text>Johnsmith@gmail.com</Text>
      </Flex>
    </Flex>
  );
  // return (
  // <ProfileMenu
  //   // offset={[22, 22]}
  //   menuButtonProps={{
  //     as: (

  //     ),
  //   }}
  // />
  // );
}

// function SideNavContent() {
// 	if (!activePage?.parentLink.route) return <>no route</>;
// 	// if (!activePage?.sideNav || activePage.sideNav !== 'custom')
// 	// 	return <Text textColor="white">default side nav</Text>;

// 	const DynamicComponent = lazy(() =>
// 		import(`layouts/sideNavContent${activePage.route}`).catch(
// 			() => ({
// 				default: () => (
// 					<Text color="white">{activePage.parentLink.label} sidenav</Text>
// 				),
// 			})
// 		)
// 	);

// 	return (
// 		<Suspense fallback={<></>}>
// 			<DynamicComponent {...props} />
// 		</Suspense>
// 	);
// }
