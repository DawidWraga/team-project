import { useRouter } from 'next/router';
import posts from 'db/posts';
import  comments  from 'db/postComments';
import { Reply } from 'components/Reply';
import { useState } from 'react';
import { Avatar, Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { AddReply } from 'components/addReply';
import { Paper } from 'styles/Paper';
import { PageWrapper } from 'styles/PageWrapper';

export default function ForumPost(props) {
	const {} = props;
	const [replyActive, setReplyActive] = useState(false);

	const router = useRouter();
	const { id } = router.query;

	const post = posts.find((item) => id === item.id);
	if (!post) return <></>;

	function toggleRepBox() {
		setReplyActive((replyActive) => !replyActive);
	}

	function filterReplies(comments, posts) {
		return comments.filter((comment) => id == comment.postId);
	}

	return (
		<PageWrapper  py="4" px="4" flexDirection={'column'}>
			<Paper variant="elevated" display="inline-block" py="3" px="4" w='100%'>
				<Flex alignItems={'center'} gap="4px">
					<Avatar size={'md'}></Avatar>
					<Text>{post.name}</Text>
					<Text paddingRight={'4'}>{post.timesince} ago</Text>
				</Flex>
				<Box>
					<Text fontWeight={'bold'} fontSize="2xl">
						{post.title}
					</Text>
					<Text>{post.desc}</Text>
				</Box>
				<Button onClick={toggleRepBox}>Reply</Button>
				{replyActive && <AddReply />}
			</Paper>
			<Flex
				justifyContent={'center'}
				gap={'4px'}
				flexDirection={'column'}
				maxW={'100%'}
				paddingTop={'4px'}
			>
				{filterReplies(comments, posts).map((comment) => (
					<Reply comment={comment} key={comment.id} />
				))}
			</Flex>
		</PageWrapper>
	);
}
