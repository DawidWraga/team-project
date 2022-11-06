import { Box, Flex, Text } from '@chakra-ui/react';
import posts from 'db/posts';
import { Post } from 'components/Post';
import { AddPostForm } from 'components/AddPostForm';
import { useRouter } from 'next/router';

export default function ForumsPage(props) {
  const {} = props;

  const router = useRouter();

  const topicId = router.query?.topicId;
  const solved = router.query?.filter;

  console.table({ topicId, solved });

  let relevantPosts = [...posts];
  if (topicId)
    relevantPosts = relevantPosts.filter(
      (post) => `${post.topicId}` === topicId
    );

  switch (solved) {
    case 'solved':
      relevantPosts = relevantPosts.filter((post) => post.solved);
      break;
    case 'unsolved':
      relevantPosts = relevantPosts.filter((post) => !post.solved);
      break;
    default:
      break;
  }

  return (
    <Flex
      gap={'20px'}
      padding={'10px'}
      w="100%"
      // bgColor={'gray.200'}
      // height="100vh"
      justifyContent="center"
    >
      {/* <Flex gap={'5px'} flexDirection={'column'}>
				<Text
					backgroundColor={'white'}
					w="clamp(200px,20vw,750px)"
					py="2"
					px="4"
					rounded="sm"
					fontSize={'xl'}
					fontWeight={'semibold'}
				>
					Topics
				</Text>
				{topics.map((topic) => (
					<Topic topic={topic} key={topic.id} />
				))}
			</Flex> */}
      <Flex
        gap={'5px'}
        w={{ base: 'calc(100vw - 20px)', md: 'clamp(350px,75vw,950px)' }}
        flexDirection={'column'}
      >
        <Text
          backgroundColor={'white'}
          // w="clamp(350px,60vw,750px)"
          py="2"
          px="4"
          rounded="sm"
          fontSize={'xl'}
          fontWeight={'semibold'}
        >
          Posts
        </Text>
        {relevantPosts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Flex>
      {/* <Button onClick={toggleForm}>Show/Hide form</Button> }
      {formActive && <AddPostForm />} */}
      <AddPostForm />
    </Flex>
  );
}
