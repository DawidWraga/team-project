import { Flex, Text, Icon, FlexProps, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { isMobile } from 'utils/checkScreenWidth';
import { useActiveSideNavLink } from 'utils/useActiveSideNavLink';
import { IPage } from 'config/pages';
import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';
import { MdForum, MdKeyboardArrowRight, MdPeopleAlt } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const routeToIconMap = {
  '/forums': MdForum,
  '/docs': HiDocumentText,
  '/projects': FaTasks,
  '/users': MdPeopleAlt,
  '/dashboard': RiDashboardFill,
};

interface IProps {
  page: IPage;
}

const linkStyling = (isActive: boolean): FlexProps => ({
  _hover: {
    bgColor: 'shade.light',
    cursor: 'pointer',
  },
  py: '2',
  px: '1.5',
  w: '100%',
  bgColor: isActive ? 'shade.min' : 'shade.main',
});

export function NavItem(props: IProps) {
  const router = useRouter();

  const { page } = props;

  const { route, label } = page.parentLink;

  const hasSideNavLinks = page?.sideNavLinks?.length;

  const [isOpen, setIsOpen] = useState(false);

  const { activePage, setSideNavIsOpen } = useLayoutStore();

  const { activeSideNavLink } = useActiveSideNavLink();

  const isActive = activePage?.parentLink?.route?.includes(route);

  const Divider = () => {
    return (
      <Box w={isOpen ? '100%' : 0} h="1px" bgColor={'white'} transition="width 0.2s" />
    );
  };

  return (
    <>
      <Flex
        my="1px"
        onClick={() => {
          if (hasSideNavLinks) {
            setIsOpen((prev) => !prev);
            return;
          }

          router.push(route);
          isMobile() && setSideNavIsOpen(false);
        }}
        alignItems="center"
        {...linkStyling(isActive && !isOpen)}
      >
        <Icon
          fontSize="xl"
          textColor={isActive ? 'brand.main' : 'white'}
          as={routeToIconMap[route]}
          transition="all 200ms"
          ml="2"
          mr="3"
        />
        <Text fontSize="lg">{label}</Text>
        {hasSideNavLinks && (
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={isOpen && 'rotate(90deg)'}
            transition="transform .2s"
          />
        )}
      </Flex>
      <AnimatePresence>
        {hasSideNavLinks && isOpen && (
          <Box
            as={motion.div}
            variants={{
              closed: { height: '0px', transition: { duration: 0.12 } },
              open: {
                height: 'min-content',
                transition: { duration: 0.2, ease: 'easeInOut' },
              },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            overflow={'hidden'}
          >
            <Divider />
            <Flex flexDir={'column'} mb="2">
              {page?.sideNavLinks?.map((page) => {
                return (
                  <Flex
                    {...linkStyling(activeSideNavLink?.route?.includes(page?.route))}
                    onClick={() => {
                      if (page.route.includes('/projects'))
                        return router.push(page.route + '/tasks');
                      router.push(page.route);
                    }}
                  >
                    <Text fontSize={'md'}>{page.label}</Text>
                  </Flex>
                );
              })}
            </Flex>
            {/* <Divider /> */}
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
