import { Text } from '@chakra-ui/react';
import posts from 'db/posts';
import { Post } from 'components/Post';
import { AddPostForm } from 'components/AddPostForm';
import { useRouter } from 'next/router';
import { PageWrapper } from 'styles/PageWrapper';
import { Paper } from 'styles/Paper';

export default function ForumsPage(props) {
	const {} = props;

	const router = useRouter();

	const topicId = router.query?.topicId;

	let relevantPosts = [...posts];
	if (topicId)
		relevantPosts = relevantPosts.filter((post) => post.topicId === +topicId);

	return (
		<>
			<PageWrapper display="flex" gap="1" flexDir={'column'}>
				<Paper py="2" px="4" mb="2">
					<Text fontSize={'xl'} fontWeight={'semibold'}>
						Posts
					</Text>
				</Paper>
				{relevantPosts.map((post) => (
					<Post post={post} key={post.id} />
				))}
			</PageWrapper>
			<AddPostForm />
		</>
	);
}
