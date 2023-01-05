import { Flex, Heading, Text } from '@chakra-ui/react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useRouter } from 'next/router';

export default function HeaderContent(props) {
  const {} = props;
  const router = useRouter();
  const { activePage, activeSideNavLink } = useLayoutStore();
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

  const activeHeaderPage = activePage?.headerLinks?.find((link) =>
    router.asPath.includes(link.route)
  );

  return (
    <Flex
      h="100%"
      alignItems="center"
      flexDir={'row'}
      flexWrap="wrap"
      gap={{ base: 0, md: 2 }}
      textColor={'shade.inv'}
      ml={{ base: 0, lg: 2 }}
      pr="50px"
    >
      <Heading
        // mx={{ base: 'auto', lg: 5 }}
        fontSize={{ base: '1rem', sm: '1.2rem', lg: '1.35rem' }}
        fontWeight={500}
        wordBreak={'keep-all'}
        ml={{ base: 'auto', md: 'unset' }}
        mr={{ base: '4px', md: 'unset' }}
        // minW={{ base: 'unset', lg: '100px' }}
      >
        {activePage?.parentLink?.label}
      </Heading>
      {activeSideNavLink && (
        <Heading
          fontSize={{ base: '1rem', sm: '1.2rem', lg: '1.35rem' }}
          fontWeight={500}
          wordBreak={'keep-all'}
          mr={{ base: 'auto', md: 'unset' }}
        >
          / {activeSideNavLink?.label}
        </Heading>
      )}
      {activePage.headerLinks && (
        <>
          {/* <Flex
            display={{ base: 'inline-block', md: 'none' }}
            mx="auto"
            // w="calc(100vw-100px)" mx="auto"
          >
            <Heading
              fontSize={{ base: '1rem', sm: '1.2rem', lg: '1.35rem' }}
              fontWeight="semibold"
              wordBreak={'keep-all'}
              textAlign="center"
            >
              / {activeHeaderPage?.label}
            </Heading>
          </Flex> */}
          <Flex
            // display={{ base: 'none', md: 'inline-block' }}
            gap={2}
            pt={{ base: 0, md: '1' }}
            mx={{ base: 'auto', md: 'unset' }}
            pl="8px"
          >
            {activePage.headerLinks.map((link) => {
              const isActive = router.asPath.includes(link.route);

              return (
                <Text
                  // variant={'unstyled'}
                  key={link.route}
                  h="18px"
                  textTransform={'capitalize'}
                  position="relative"
                  pt={{ base: '0px', md: 'unset' }}
                  bottom={{ base: '4px', md: '10px' }}
                  textColor={isActive ? 'white' : 'gray.400'}
                  fontSize={{ base: '1rem', md: '1.35rem' }}
                  verticalAlign="center"
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
                  // textDecorationLine={isActive ? 'underline' : 'none'}
                >
                  {link.label}
                  {/* <div className="inline-block relative bottom-1">
								</div> */}
                </Text>
              );
            })}
          </Flex>
        </>
      )}
    </Flex>
  );
}

// !logic for appear/dissapear X icon (useful for select/deselect filter)
// rightIcon={
//   <Icon
//     as={MdClose}
//     fontSize={isActive && link.route.includes('=') ? '1.2rem' : '0rem'}
//     transition="font-size 300ms"
//     position="relative"
//     top="2.2px"
//   />
// }

//               if (link.route.includes('&') && !headerLinkStart.includes('?'))
// headerLinkStart = headerLinkStart + '?';

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
