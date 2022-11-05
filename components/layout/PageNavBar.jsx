import { Flex, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DesktopOnly } from '../deviceTypes';
import PageNavItem from './PageNavItem';
import { LogoIcon } from 'components/BrandLogo';
import ProfileMenu from 'components/ProfileMenu';
import { useGlobalContext } from 'contexts/GlobalContext';
import pages from 'config/pages';

export default function PageNavBar(props) {
	const {} = props;
	const router = useRouter();
	const { activePage } = useGlobalContext();

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
			zIndex="banner"
			py={{ lg: 2 }}
		>
			<DesktopOnly
				// mb="20vh"
				mb="9px"
			>
				<LogoIcon fontSize="2.7rem" />
			</DesktopOnly>

			{pages.map((page) => {
				return (
					<PageNavItem
						key={page.parentLink.route}
						route={page.parentLink.route}
						label={page.parentLink.label}
						isActive={activePage?.parentLink.route?.includes(
							page.parentLink.route
						)}
					/>
				);
			})}
			<Spacer flexGrow={1} />
			{/* <DesktopOnly
				display={{ base: 'none', lg: 'inline-flex' }}
				mt="auto"
				flexDir="column"
				gap="2"
			>
				<ProfileMenu offset={[0, 10]} placement="right" />
			</DesktopOnly> */}
		</Flex>
	);
}
