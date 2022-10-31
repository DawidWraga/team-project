import { Flex } from '@chakra-ui/react';
import { posts } from 'db/posts';
import { Card } from 'components/card';

export default function DocsPage(props) {
	const {} = props;

	return (
		<Flex h="50vh" alignContent={'flex-start'}>
			{posts.map((card) => (
				<Card title={card.title} key={card.title} src={card.src} />
			))}
		</Flex>
	);
}
