import { Box, Flex, Heading, Button, Icon } from '@chakra-ui/react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useRouter } from 'next/router';
import { MdClose } from 'react-icons/md';
import { useActiveSideNavLink } from 'utils/useActiveSideNavLink';

export default function HeaderContent(props) {
  const {} = props;
  const router = useRouter();
  const { activePage } = useLayoutStore();
  const { activeSideNavLink } = useActiveSideNavLink();
  if (!activePage) return <></>;

  const getHeaderLinkStart = () => {
    let headerLinkStart = '';
    const urlArray = router.asPath.split('/');
    if (urlArray.length === 2) {
      headerLinkStart = router.asPath.split('&')[0];
    } else {
      urlArray.pop();
      headerLinkStart = urlArray.join('/');
    }

    return headerLinkStart;
  };

  let headerLinkStart = getHeaderLinkStart();

  return (
    <Flex h="100%" alignItems="center" flexDir="row" gap="5">
      <Heading
        mx={{ base: 'auto', lg: 5 }}
        fontSize="1.5rem"
        fontWeight="semibold"
        textColor={'shade.inv'}
        minW={{ base: 'unset', lg: '100px' }}
      >
        {activeSideNavLink?.label || activePage?.parentLink?.label}
      </Heading>

      {activePage.headerLinks && (
        <Flex gap={[2, 3, 4, 5, 6]} pt="1">
          {activePage.headerLinks.map((link) => {
            const isActive = router.asPath.includes(link.route);

            if (link.route.includes('&') && !headerLinkStart.includes('?'))
              headerLinkStart = headerLinkStart + '?';

            return (
              <Button
                key={link.route}
                // color="white"
                // colorScheme="white"
                // verticalAlign={'center'}
                // h="100%"
                textColor={isActive ? 'white' : 'gray.400'}
                fontSize={{ base: '1rem', lg: '1.4rem' }}
                variant={'unstyled'}
                verticalAlign="center"
                // variant={isActive ? 'solid' : 'outline'}
                // opacity="0.9"
                // fontSize="1.2rem"
                transition="all 300ms"
                pl={{ base: 1, md: 4, lg: 8 }}
                onClick={() => {
                  if (!isActive) {
                    router.push(headerLinkStart + link.route);
                  }

                  if (isActive && link.route.includes('=')) {
                    router.push(router.asPath.replace(link.route, ''));
                  }
                }}
                _hover={{
                  cursor: 'pointer',
                  textColor: 'white',
                }}
                textDecorationLine={isActive ? 'underline' : 'none'}
                rightIcon={
                  <Icon
                    as={MdClose}
                    fontSize={isActive && link.route.includes('=') ? '1.2rem' : '0rem'}
                    transition="font-size 300ms"
                    position="relative"
                    top="2.2px"
                  />
                }
              >
                {link.label}
                {/* <div className="inline-block relative bottom-1">
								</div> */}
              </Button>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}

// 		{activePage.headerLinks && (
// <Flex gap={[2, 3, 4, 5, 6]} pt="1">
// {activePage.headerLinks.map((link) => {
// 	const isActive = router.asPath.includes(link.route);

// 	if (link.route.includes('&') && !headerLinkStart.includes('?'))
// 		headerLinkStart = headerLinkStart + '?';

// 	return (
// 		<Tag
// 			key={link.route}
// 			// color="white"
// 			// colorScheme="white"
// 			// verticalAlign={'center'}
// 			// h="100%"
// 			size="lg"
// 			borderRadius="full"
// 			variant={isActive ? 'solid' : 'outline'}
// 			opacity="0.9"
// 			colorScheme={'brand'}
// 			// fontSize="1.2rem"
// 			transition="all 300ms"
// 			pl={8}
// 			onClick={() => {
// 				if (!isActive) {
// 					router.push(headerLinkStart + link.route);
// 				}

// 				if (isActive) {
// 					router.push(router.asPath.replace(link.route, ''));
// 				}
// 			}}
// 			_hover={{
// 				cursor: 'pointer',
// 				bgColor: !isActive && 'brand.400',
// 				textColor: 'white',
// 			}}
// 			_active={{ bgColor: 'brand.500' }}
// 			// _active={{"& > .line":{
// 			// 	width:"100%"
// 			// }}}
// 			// textDecorationLine={isActive ? 'underline' : 'none'}
// 			// textDecorationColor={isActive ? 'brand' : 'none'}
// 			// color="white"
// 		>
// 			<TagLabel>{link.label}</TagLabel>
// 			<TagCloseButton
// 				fontSize={isActive ? '1.2rem' : '0rem'}
// 				transition="font-size 300ms"
// 			/>
// 		</Tag>
// 	);
// })}
