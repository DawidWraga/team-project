import { Flex } from '@chakra-ui/react';
import pages from 'db/pages.json';
import { useRouter } from 'next/router';
import { DesktopOnly } from '../deviceTypes';
import PageNavItem from './PageNavItem';
import { LogoIcon } from 'components/Logo';
import ProfileMenu from 'components/ProfileMenu';

export default function PageNavBar(props) {
	const {} = props;
	const router = useRouter();

	const activePage =
		pages.find((page) => router.pathname.includes(page.route)) || 'home';

	return (
		<Flex
			position="fixed"
			h={{ base: '60px', lg: '100%' }}
			w={{ base: '100vw', lg: '60px' }}
			justifyContent={{ base: 'stretch', lg: 'center' }}
			alignContent="center"
			alignItems="center"
			flexDir={{ base: 'row', lg: 'column' }}
			bgColor={'shade.main'}
			bottom={0}
			top={{ lg: 0 }}
			zIndex="overlay"
			py={{ lg: 2 }}
		>
			<DesktopOnly mb="30px">
				<LogoIcon fontSize="2.7rem" />
			</DesktopOnly>

			{pages.map((page) => {
				return (
					<PageNavItem
						key={page.route}
						route={page.route}
						label={page.label}
						isActive={activePage?.route?.includes(page.route)}
					/>
				);
			})}
			<DesktopOnly
				display={{ base: 'none', lg: 'inline-flex' }}
				mt="auto"
				flexDir="column"
				gap="2"
			>
				{/* <Avatar size="sm"></Avatar> */}
				<ProfileMenu offset={[0, 10]} placement="right" />
			</DesktopOnly>
		</Flex>
	);
}
