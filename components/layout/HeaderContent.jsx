import { Box, Flex, Heading } from '@chakra-ui/react';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useRouter } from 'next/router';

export default function HeaderContent(props) {
	const {} = props;
	const router = useRouter();
	const { activePage, sideNavIsOpen, setSideNavIsOpen } = useGlobalContext();

	if (!activePage) return <>no active</>;

	let label = activePage.parentLink.label;

	const hasSideNav = activePage.sideNavLinks && activePage.sideNavLinks.length;
	let activePageIsParent = true;

	if (hasSideNav) {
		const activeSideNavLink = activePage.sideNavLinks.find(
			(link) => link.route === router.asPath
		);

		if (activeSideNavLink) {
			label = activeSideNavLink.label;
			activePageIsParent = false;
		} else label = 'All ' + label;
	}

	return (
		<Flex h="100%" alignItems="center" flexDir="row" gap="5">
			<Heading
				mx={{ base: 'auto', lg: 5 }}
				fontSize="1.5rem"
				fontWeight="semibold"
				textColor={'shade.inv'}
			>
				{label || 'page not found'}
			</Heading>

			{activePage.headerLinks && (
				<Flex gap="5" pt="1">
					{activePage.headerLinks.map((link) => {
						return (
							<Box
								key={link.route}
								color="white"
								verticalAlign={'center'}
								h="100%"
								fontSize="1.2rem"
								onClick={() => router.push(link.route)}
								_hover={{ cursor: 'pointer' }}
							>
								{link.label}
							</Box>
						);
					})}
				</Flex>
			)}
		</Flex>
	);
}
