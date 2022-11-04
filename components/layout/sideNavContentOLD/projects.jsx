import { Flex, Text, Icon } from '@chakra-ui/react';
import projects from 'db/projects.json';
import { useRouter } from 'next/router';
import { BsChevronDown } from 'react-icons/bs';
import { useGlobalContext } from 'contexts/GlobalContext';
import { isMobile } from 'utils/checkScreenWidth';

export default function ProjectsSideNavContent(props) {
	const {} = props;
	const router = useRouter();
	const { setSideNavIsOpen } = useGlobalContext();

	return (
		<Flex flexDir="column" mt="55px">
			{projects.map((p) => {
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
							router.push(`/projects/${p.id}/dashboard`);
							isMobile() && setSideNavIsOpen(false);
						}}
					>
						<Text color="white" fontSize="1.2rem">
							{p.title}
						</Text>
						<Icon as={BsChevronDown} color="white" fontSize="1.2rem" />
					</Flex>
				);
			})}
		</Flex>
	);
}
