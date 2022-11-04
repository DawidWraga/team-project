import { Flex, Text, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BsChevronDown } from 'react-icons/bs';
import { useGlobalContext } from 'contexts/GlobalContext';
import { isMobile } from 'utils/checkScreenWidth';

export default function SideNavContent(props) {
	const {} = props;
	const router = useRouter();
	const { activePage, setSideNavIsOpen } = useGlobalContext();

	return (
		<Flex flexDir="column" mt="55px">
			{activePage?.sideNavLinks?.map((project) => {
				return (
					<Flex
						py="2"
						px="1.5"
						justifyContent={'space-between'}
						alignItems="center"
						_hover={{
							bgColor: 'shade.min',
							cursor: 'pointer',
						}}
						onClick={() => {
							router.push(project.route);
							isMobile() && setSideNavIsOpen(false);
						}}
					>
						<Text color="white" fontSize="1.2rem">
							{project.label}
						</Text>
						<Icon as={BsChevronDown} color="white" fontSize="1.2rem" />
					</Flex>
				);
			})}
		</Flex>
	);
}
