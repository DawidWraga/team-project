import { SpinnerIcon } from '@chakra-ui/icons';
import { Box, Icon, Text } from '@chakra-ui/react';
import { useLayoutStore } from 'stores/LayoutStore';
import { MdClose } from 'react-icons/md';
import { lazy, Suspense } from 'react';
import { isMobile } from 'utils/checkScreenWidth';
import { AnimatePresence, motion } from 'framer-motion';
import SideNavContent from './SideNavContent';

export default function SideNav(props) {
  const {} = props;

  const { sideNavIsOpen, setSideNavIsOpen } = useLayoutStore();

  // if (!activePage) return <>no active page</>;

  // function SideNavContent() {
  // 	if (!activePage?.parentLink.route) return <>no route</>;
  // }

  return (
    <>
      <Box
        h="100vh"
        w={{ base: 'clamp(250px,70vw,350px)', lg: '200px' }}
        position="fixed"
        bgColor="shade.light"
        left={{
          base: sideNavIsOpen ? '0' : '-350px',
          lg: sideNavIsOpen ? '60px' : '-180px',
        }}
        top="0"
        zIndex={{ base: 'popover', lg: 'sticky' }}
        className="dingbop"
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
            transition={{ duration: 100 }}
            onClick={() => setSideNavIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// function SideNavContent() {
// 	if (!activePage?.parentLink.route) return <>no route</>;
// 	// if (!activePage?.sideNav || activePage.sideNav !== 'custom')
// 	// 	return <Text textColor="white">default side nav</Text>;

// 	const DynamicComponent = lazy(() =>
// 		import(`components/layout/sideNavContent${activePage.route}`).catch(
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
