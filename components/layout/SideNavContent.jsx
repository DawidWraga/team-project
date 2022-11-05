import { Flex, Text, Icon, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BsChevronDown } from 'react-icons/bs';
import { useGlobalContext } from 'contexts/GlobalContext';
import { isMobile } from 'utils/checkScreenWidth';
import { ScreenDependent } from '../deviceTypes';
import { Logo } from 'components/BrandLogo';
import { useActiveSideNavLink } from 'utils/useActiveSideNavLink';

export default function SideNavContent(props) {
	const {} = props;
	const router = useRouter();
	const { activePage, setSideNavIsOpen } = useGlobalContext();

	const { activeSideNavLink } = useActiveSideNavLink();

	return (
		<>
			<Flex
				alignItems="center"
				justifyContent="center"
				w="100%"
				h="60px"
				bgColor="shade.main"
			>
				<Logo
					sx={{
						'& > svg': {
							display: { base: '', lg: 'none' },
							fontSize: '1.7rem',
						},
						'& > h2': { fontSize: '1.5rem', color: 'white' },
					}}
				/>
			</Flex>
			<Flex flexDir="column">
				{activePage?.sideNavLinks?.map((item) => {
					const isActive = activeSideNavLink?.route === item.route;

					return (
						<Flex key={item.route} px="1" py="0.5" h="60px">
							<Flex
								justifyContent={'space-between'}
								alignItems="center"
								_hover={{
									bgColor: 'shade.min',
									cursor: 'pointer',
								}}
								py="2"
								px="1.5"
								w="100%"
								rounded="sm"
								onClick={() => {
									router.push(item.route + item.defaultHeaderLink);
									isMobile() && setSideNavIsOpen(false);
								}}
								bgColor={isActive ? 'shade.min' : 'shade.light'}
							>
								<Text
									color={'white'}
									fontSize="sm"
									fontWeight={isActive ? 'bold' : 'normal'}
								>
									{item.label}
								</Text>
								<Icon
									as={BsChevronDown}
									color="white"
									fontSize="1rem"
									className="-rotate-90"
								/>
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</>
	);
}
