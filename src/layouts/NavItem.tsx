import { Flex, Text, Icon, FlexProps, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { isMobile } from 'utils/checkScreenWidth';
import { IPage } from 'config/pages';
import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';
import { MdForum, MdKeyboardArrowRight, MdPeopleAlt } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';
import { useCallback } from 'react';
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

  const {
    activePage,
    setSideNavIsOpen,
    openAccordianRoute,
    setOpenAccordianRoute,
    activeSideNavLink,
    setActiveSideNavLink,
  } = useLayoutStore();
  // const { activeSideNavLink } = useActiveSideNavLink();

  const isOpen = hasSideNavLinks && openAccordianRoute.includes(route);

  const isActive = activePage?.parentLink?.route?.includes(route);

  const linkStyling = (isActive: boolean): FlexProps => ({
    _hover: {
      bgColor: !isOpen && 'shade.light',
      cursor: 'pointer',
    },
    py: '2.5',
    px: '1.5',
    mx: '5px',
    rounded: 'md',
    // _active: {
    //   bgColor: 'shade.light',
    // },

    outline: isOpen
      ? 'solid 1px hsla(255 100% 100% / 0.3)'
      : 'solid 0px hsla(255 100% 100% / 0)',
    transition: 'outline .2s ease-in-out, background-color .1s ease-in-out',

    bgColor: isActive ? 'shade.light' : 'shade.main',
    // fontWeight: isActive ? 600 : 400,
    textColor: isActive ? 'white' : 'whiteAlpha.900',

    // bgColor: isActive || isOpen ? 'shade.light' : hade.main',
  });

  const Divider = useCallback(() => {
    return (
      <>
        {isOpen && (
          <Box
            key={`${route}-underline`}
            as={motion.div}
            position="relative"
            top="2"
            initial={{
              width: 0,
              left: '50%',
              opacity: 1,
              // transition: { duration: 0.2, ease: 'linear' },
            }}
            animate={{
              width: 'calc(100% - 16px)',
              left: '5%',
              opacity: 1,
              transition: { duration: 0.15, ease: 'linear' },
            }}
            exit={{
              opacity: 0,
              width: '5%',
              left: '50%',
              transition: { duration: 2, ease: 'linear' },
            }}
            // transition={'all 0.2'}
            // width={isOpen ? '200px' : '0px'}
            h="1px"
            bgColor={'white'}
            // transition="all 0.4s"
          />
        )}
      </>
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
            textColor={isActive ? 'white' : 'whiteAlpha.900'}
            // textColor={isActive ? 'brand.main' : 'white'}
            as={routeToIconMap[route]}
            transition="all 200ms"
            ml="2"
            mr="3"
          />
          <Text
            fontSize="1.18rem"
            // textColor={isActive ? 'brand.300' : 'white'}
            // textDecoration={isActive ? 'underline' : 'none'}
            // textDecorationColor={isActive ? 'brand.300' : 'white'}
          >
            {label}
          </Text>
          {hasSideNavLinks && (
            <Icon
              as={MdKeyboardArrowRight}
              ml="auto"
              transform={isOpen ? 'rotate(-90deg)' : 'rotate(90deg)'}
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
              <Flex flexDir={'column'} my="2" pt="1">
                {page?.sideNavLinks?.map((page) => {
                  const sidenavActive = activeSideNavLink?.route?.includes(page?.route);
                  return (
                    <Flex
                      key={page.route}
                      {...linkStyling(sidenavActive)}
                      onClick={() => {
                        // temporary fix for routing to /tasks by default
                        let { route } = page;
                        if (page.route.includes('/projects')) route += '/tasks';

                        router.push(route);
                        setActiveSideNavLink(page);
                        isMobile() && setSideNavIsOpen(false);
                      }}
                      mx="auto"
                      w="calc(100% - 14px)"
                      px="2"
                      my="2px"
                      // bgColor={sidenavActive ? 'shade.min' : 'shade.light'}
                      _hover={{ bgColor: 'shade.light' }}
                      outline="none"
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