import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useRouter } from 'next/router';
import { useActiveSideNavLink } from 'utils/useActiveSideNavLink';

export default function HeaderContent(props) {
	const {} = props;
	const router = useRouter();
	const { activePage } = useGlobalContext();
	const { activeSideNavLink } = useActiveSideNavLink();

	if (!activePage) return <>no active</>;

	let label = activePage.parentLink.label;

	let headerLinkStart = '';

	// label = activeSideNavLink.label;
	// activePageIsParent = false;

	const urlArray = router.asPath.split('/');

	if (urlArray.length === 2) {
		headerLinkStart = router.asPath.split('&')[0];
	} else {
		urlArray.pop();

		headerLinkStart = urlArray.join('/');
	}

	return (
		<Flex h="100%" alignItems="center" flexDir="row" gap="5">
			<Heading
				mx={{ base: 'auto', lg: 5 }}
				fontSize="1.5rem"
				fontWeight="semibold"
				textColor={'shade.inv'}
			>
				{activeSideNavLink?.label || activePage.parentLink.label}
			</Heading>

			{activePage.headerLinks && (
				<Flex gap={[2, 3, 4, 5, 6]} pt="1">
					{activePage.headerLinks.map((link) => {
						const isActive = activeSideNavLink?.route.includes(link.route);

						return (
							<Button
								variant="link"
								key={link.route}
								// color="white"
								colorScheme="white"
								verticalAlign={'center'}
								h="100%"
								fontSize="1.2rem"
								onClick={() =>
									router.push(
										headerLinkStart +
											(link.route.includes('&') &&
											!headerLinkStart.includes('?')
												? '?' + link.route
												: link.route)
									)
								}
								_hover={{ cursor: 'pointer' }}
								// _active={{"& > .line":{
								// 	width:"100%"
								// }}}
								textDecorationLine={isActive ? 'underline' : 'none'}
								textDecorationColor={isActive ? 'brand' : 'none'}
								color="white"
							>
								{link.label}
							</Button>
						);
					})}
				</Flex>
			)}
		</Flex>
	);
}
