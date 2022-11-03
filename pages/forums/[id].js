import { useRouter } from 'next/router';
import { posts } from 'db/posts';
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Spacer,
} from '@chakra-ui/react';

export default function ForumPost(props) {
  const {} = props;

  const router = useRouter();
  const { id } = router.query;

  const post = posts.find((item) => +id === item.id);
  if (!post) return <div>No post</div>;

  return (
    <Box backgroundColor={'white'} py="4" px="4">
      <Flex alignItems={'center'} gap="4px">
        <Avatar size={'md'}></Avatar>
        <Text>{post.name}</Text>
        <Spacer />
        <Text paddingRight={'4'}>{post.timesince} ago</Text>
      </Flex>
      <Box>
        <Text fontWeight={'bold'} fontSize="2xl">
          {post.title}
        </Text>
        <Text>{post.desc}</Text>
        <Button colorScheme={'brand'}>Reply</Button>
      </Box>
    </Box>
  );
}
