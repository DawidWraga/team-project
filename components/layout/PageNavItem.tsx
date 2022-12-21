import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';
import { MdForum, MdPeopleAlt } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLayoutStore } from 'stores/LayoutStore';

// quick solutioin to navigate to first project default on routing to projects
const getProcessedRoute = (route) => {
  if (route === '/projects') return '/projects/1/dashboard';
  if (route === '/docs') return '/docs/welcome';

  return route;
};
interface IProps {
  route: string;
  label: string;
}
export default function PageNavItem(props: IProps) {
  const { route, label } = props;

  // const {activePage} = useStore
  const { activePage } = useLayoutStore();

  const isActive = activePage?.parentLink?.route?.includes(route);

  // const { sideNavIsOpen, setSideNavIsOpen } = useLayoutStore();

  const routeToIconMap = {
    '/forums': MdForum,
    '/docs': HiDocumentText,
    '/projects': FaTasks,
    '/users': MdPeopleAlt,
    '/dashboard': RiDashboardFill,
  };

  return (
    <>
      <Link href={getProcessedRoute(route)}>
        <Flex
          as="a"
          w="100%"
          flexDir="column"
          justifyContent={'center'}
          alignItems="center"
          // onClick={() => {
          // if (!isMobile() && !sideNavIsOpen) setSideNavIsOpen(true);
          // }}
          bgColor={isActive ? 'shade.light' : ''}
          _hover={{
            bgColor: { md: 'shade.light' },
            cursor: 'pointer',
            '& > .chakra-text': {
              fontSize: 'sm',
            },
            '& > .page-nav-icon': {
              fontSize: '1.5rem',
            },
          }}
          sx={{
            ...(isActive && {
              '& > .chakra-text': {
                fontSize: 'sm',
              },
              '& > .page-nav-icon': {
                fontSize: '1.5rem',
              },
            }),
          }}
          position="relative"
          p="1"
          h={{ base: '100%', lg: '60px' }}
        >
          {isActive && (
            <Box
              as={motion.div}
              layoutId="highlight"
              initial={{ backgroundColor: 'none' }}
              exit={{ backgroundColor: 'none' }}
              animate={{
                backgroundColor: 'rgb(255, 152, 0)',
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                },
              }}
              h={{ base: '1', lg: '100%' }}
              w={{ base: '100%', lg: '1' }}
              roundedRight={{ base: 'unset', lg: 'md' }}
              roundedTop={{ base: 'lg', lg: 'unset' }}
              position="absolute"
              bottom="0"
              left={{ base: 'unset', lg: 0 }}
            ></Box>
          )}
          <Icon
            className="page-nav-icon"
            fontSize={{ base: '1.5rem', lg: '1.8rem' }}
            textColor={'white'}
            as={routeToIconMap[route]}
            transition="all 200ms"
          />
          <Text
            fontSize={{ base: 'sm', lg: '0' }}
            textColor="white"
            position="relative"
            fontWeight={'normal'}
            transition="all 200ms"
          >
            {label}
          </Text>
        </Flex>
      </Link>
    </>
  );
}
