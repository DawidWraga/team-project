import { useRouter } from 'next/router';
import { Reply } from 'components/Reply';
import { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { AddReply } from 'components/addReply';
import { Paper } from 'styles/Paper';
import { PageWrapper } from 'styles/PageWrapper';
import { AnimatePresence } from 'framer-motion';
import query from 'controllers/query';
import axios from 'axios';

export const getServerSideProps = async (ctx) => {
	const { id } = ctx.params;

	const posts = await query('posts');
	const post = posts.find((item) => item.id === id);
	const comments = await query('postComments');
	const relevantComments = comments.filter((comment) => id == comment.postId);

	return {
		props: { post, relevantComments },
	};
};

export default function ForumPost(props) {
	const { post, relevantComments } = props;
	const [replyActive, setReplyActive] = useState(false);

	// const [updatedComments, setUpdatedComments] = useState(relevantComments);

	// useEffect(() => {
	// 	// dont refersh on opening
	// 	if (replyActive === true) return;

	// 	// DO refersh on closing

	// 	(async () => {
	// 		const newComments = await axios('/db/postComments');
	// 		console.log('🔷 >> useEffect >> newComments', newComments);
	// 	})();
	// }, [replyActive]);

	// const { id } = post;

	if (!post) return <></>;
	// redirect back to forum

	function toggleRepBox() {
		setReplyActive((replyActive) => !replyActive);
	}

	return (
		<PageWrapper py="4" px="4" flexDirection={'column'}>
			<Paper variant="elevated" display="inline-block" py="3" px="4" w="100%">
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
				<Button onClick={toggleRepBox} colorScheme="brand" mt="3" mb="2">
					Reply
				</Button>
				<AnimatePresence>
					{replyActive && <AddReply setReplyActive={setReplyActive} />}
				</AnimatePresence>
			</Paper>
			<Flex
				justifyContent={'center'}
				gap={'4px'}
				flexDirection={'column'}
				maxW={'100%'}
				paddingTop={'4px'}
			>
				{relevantComments &&
					relevantComments.map((comment) => (
						<Reply comment={comment} key={comment.id} />
					))}
			</Flex>
		</PageWrapper>
	);
}
