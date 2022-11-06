import {
	Avatar,
	Box,
	Container,
	Flex,
	Heading,
	Spacer,
	Text,
} from '@chakra-ui/react';
import { getDocBySlug, markdownToHtml, getAllDocs } from 'controllers/docs';
import { useRouter } from 'next/router';
import { Paper } from 'styles/Paper';
import markdownStyles from 'styles/markdownStyles.module.css';
import moment from 'moment/moment';

export default function IndividualDocPage(props) {
	const { doc } = props;

	const router = useRouter();

	if (!doc.slug && !router.isFallback) return <>page not found</>;

	return (
		<>
			<Container maxW="container.lg" my="8">
				<Paper as="article" variant="elevated" p="5" flexDir="column" gap="8">
					<Heading mx="auto" size="lg" mt="5">
						{doc.title}
					</Heading>
					<Spacer w="100%" h="1" border="1px solid gray" />
					<Flex alignItems="center" justifyContent={'space-between'}>
						<Flex alignItems="center" gap="1">
							<Avatar src={doc.author.img} w="2rem" h="2rem" />
							<Text fontSize="1.2rem" fontWeight="semibold">
								{doc.author.name}
							</Text>
						</Flex>
						<Text>{moment(doc.date).format('DD/MM/YYYY')}</Text>
					</Flex>
					<div
						className={markdownStyles['markdown']}
						dangerouslySetInnerHTML={{ __html: doc.content }}
					></div>
				</Paper>
			</Container>
		</>
	);
}

export const getStaticProps = async (ctx) => {
	const doc = await getDocBySlug(ctx.params.slug, [
		'title',
		'date',
		'author',
		'slug',
		'content',
	]);
	const content = await markdownToHtml(doc.content || '');

	return {
		props: { doc: { ...doc, content } },
	};
};

export const getStaticPaths = async (ctx) => {
	const docs = getAllDocs(['slug']);

	return {
		paths: docs.map((doc) => {
			return {
				params: {
					slug: doc.slug,
				},
			};
		}),
		fallback: false,
	};
};
