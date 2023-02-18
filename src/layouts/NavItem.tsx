import { Flex, Text, Icon, FlexProps, Box, IconButton } from '@chakra-ui/react';
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
import { AddIcon } from '@chakra-ui/icons';
import { useProjectModal } from 'views/task/useProjectModal';

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
  const { openProjectModal } = useProjectModal();

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

  const isActive = (activePage?.parentLink?.route + '/').includes(route);

  const linkStyling = (isActive: boolean): FlexProps => ({
    _hover: {
      bgColor: !isOpen && 'shade.light',
      cursor: 'pointer',
    },
    py: '2',
    px: '1.5',
    mx: '5px',
    rounded: 'md',

    outline: isOpen
      ? 'solid 1px hsla(255 100% 100% / 0.3)'
      : 'solid 0px hsla(255 100% 100% / 0)',
    transition: 'outline .2s ease-in-out, background-color .1s ease-in-out',

    bgColor: isActive ? 'shade.light' : 'shade.main',
    textColor: isActive ? 'white' : 'whiteAlpha.900',
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
          // if (hasSideNavLinks) {
          //   setOpenAccordianRoute(route);
          //   return;
          // }

          router.push(route);
          isMobile() && setSideNavIsOpen(false);
        }}
        // alignItems="center"
        {...linkStyling(isActive && !isOpen)}
      >
        <Flex
          justifyContent={'stretch'}
          alignItems={'center'}
          _hover={{
            '> [data-add-project]': {
              opacity: 1,
            },
          }}
        >
          <Icon
            fontSize="lg"
            textColor={isActive ? 'white' : 'whiteAlpha.900'}
            as={routeToIconMap[route]}
            transition="all 200ms"
            ml="2"
            mr="3"
          />
          <Box>
            <Text fontSize=".9rem">{label}</Text>
          </Box>
          {route === '/projects' && (
            <IconButton
              data-add-project
              variant="link"
              colorScheme={'whiteAlpha'}
              aria-label="add project"
              icon={<AddIcon />}
              ml="auto"
              opacity={0}
              _peerActive={{
                opacity: 1,
              }}
              onClick={(ev) => {
                ev.stopPropagation();
                openProjectModal({});
              }}
            />
          )}
          {hasSideNavLinks && (
            <IconButton
              aria-label="expand sidenav item"
              ml={route !== '/projects' ? 'auto' : '1'}
              variant="ghost"
              colorScheme={'whiteAlpha'}
              onClick={(ev) => {
                ev.stopPropagation();
                setOpenAccordianRoute(route);
              }}
              position="absolute"
              right="3"
            >
              <Icon
                // px="1px"
                as={MdKeyboardArrowRight}
                transform={isOpen ? 'rotate(-90deg)' : 'rotate(90deg)'}
                transition="transform .2s"
                fontSize="1rem"
              />
            </IconButton>
          )}
        </Flex>

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
              <Flex flexDir={'column'} my="3" pt="1">
                {page?.sideNavLinks?.map((page) => {
                  const sidenavActive = (activeSideNavLink?.route + '/').includes(
                    page?.route
                  );

                  return (
                    <Flex
                      key={page.route}
                      {...linkStyling(sidenavActive)}
                      onClick={(ev) => {
                        // prevent closing accordian parent on child click
                        ev.stopPropagation();
                        let { route } = page;

                        router.push(route + page.defaultHeaderLink);
                        setActiveSideNavLink(page);
                        isMobile() && setSideNavIsOpen(false);
                      }}
                      mx="auto"
                      w="calc(100% - 14px)"
                      px="2"
                      // pl="1.5rem"
                      my="1px"
                      py={2}
                      // bgColor={sidenavActive ? 'shade.min' : 'shade.light'}
                      _hover={{ bgColor: 'shade.light' }}
                      outline="none"
                    >
                      <Text fontSize={12}>{page.label}</Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          )}
        </AnimatePresence>
      </Flex>
    </>
  );
}
