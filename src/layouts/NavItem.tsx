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
import { useCallback, useState } from 'react';
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

export function NavItem(props: IProps) {
  const router = useRouter();

  const { page } = props;

  const { route, label } = page.parentLink;

  const hasSideNavLinks = page?.sideNavLinks?.length;

  const { activePage, setSideNavIsOpen, openAccordianRoute, setOpenAccordianRoute } =
    useLayoutStore();

  const isOpen = hasSideNavLinks && openAccordianRoute.includes(route);

  // const [isOpen, setIsOpen] = useState(false);

  const { activeSideNavLink } = useActiveSideNavLink();

  const isActive = activePage?.parentLink?.route?.includes(route);

  const linkStyling = (isActive: boolean): FlexProps => ({
    _hover: {
      bgColor: 'shade.light',
      cursor: 'pointer',
    },
    // stroke: 'whiteAlpha.0',
    // _active: {
    //   stroke: 'whiteAlpha.400',
    // },
    // transition: 'stroke 0.1s',
    py: '2.5',
    px: '1.5',
    // w: 'calc(100% - 4px)',
    // w: 100
    mx: '5px',
    rounded: 'md',
    _active: {
      bgColor: 'shade.light',
    },
    bgColor: isActive || isOpen ? 'shade.light' : 'shade.main',
  });

  const Divider = useCallback(() => {
    return (
      <AnimatePresence>
        {isOpen && (
          <Box
            key={`${route}-underline`}
            as={motion.div}
            position="relative"
            initial={{
              width: 0,
              left: '50%',
              // transition: { duration: 0.2, ease: 'linear' },
            }}
            animate={{
              width: '90%',
              left: '5%',
              transition: { duration: 0.15, ease: 'linear' },
            }}
            exit={{
              width: '200%',
              left: '50%',
              transition: { duration: 0.2, ease: 'linear' },
            }}
            // transition={'all 0.2'}
            // width={isOpen ? '200px' : '0px'}
            h="1px"
            bgColor={'white'}
            // transition="all 0.4s"
          />
        )}
      </AnimatePresence>
    );
  }, [isOpen]);

  return (
    <>
      <Flex
        my="2px"
        flexDir={'column'}
        // w="90%"
        alignItems="stretch"
        justifyContent={'center'}
        onClick={() => {
          if (hasSideNavLinks) {
            setOpenAccordianRoute(route);
            return;
          }

          router.push(route);
          isMobile() && setSideNavIsOpen(false);
        }}
        // alignItems="center"
        {...linkStyling(isActive && !isOpen)}
      >
        <Flex justifyContent={'stretch'} alignItems={'center'}>
          <Icon
            fontSize="xl"
            textColor={isActive ? 'brand.main' : 'white'}
            as={routeToIconMap[route]}
            transition="all 200ms"
            ml="2"
            mr="3"
          />
          <Text fontSize="1.18rem">{label}</Text>
          {hasSideNavLinks && (
            <Icon
              as={MdKeyboardArrowRight}
              ml="auto"
              transform={isOpen && 'rotate(90deg)'}
              transition="transform .2s"
            />
          )}
        </Flex>
        {/* <div> */}
        {/* </div> */}

        <Divider />
        <AnimatePresence>
          {hasSideNavLinks && isOpen && (
            <Box
              key={`${route}-menu`}
              as={motion.div}
              variants={{
                closed: {
                  height: '0px',
                  transition: { duration: 0.15, ease: 'easeInOut' },
                },
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
              <Flex flexDir={'column'} mb="2" py="1">
                {page?.sideNavLinks?.map((page) => {
                  const sidenavActive = activeSideNavLink?.route?.includes(page?.route);
                  return (
                    <Flex
                      key={page.route}
                      {...linkStyling(sidenavActive)}
                      onClick={() => {
                        if (page.route.includes('/projects'))
                          return router.push(page.route + '/tasks');
                        router.push(page.route);
                      }}
                      mx="auto"
                      w="calc(100% - 14px)"
                      px="2"
                      my="2px"
                      bgColor={sidenavActive ? 'shade.min' : 'shade.light'}
                      _hover={{ bgColor: 'shade.min' }}
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
      </Flex>
    </>
  );
}
