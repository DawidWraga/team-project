import { useRouter } from 'next/router';
import posts from 'db/posts';
import { comments } from 'db/postComments';
import { Reply } from 'components/Reply';
import { useState } from 'react';
import { Avatar, Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { AddReply } from 'components/addReply';
import { comment } from 'postcss';

export default function ForumPost(props) {
  const {} = props;
  const [replyActive, setReplyActive] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const post = posts.find((item) => id === item.id);
  if (!post) return <div>No post</div>;

  function toggleRepBox() {
    setReplyActive((replyActive) => !replyActive);
  }

  function filterReplies(comments, posts) {
    return comments.filter((comment) => id == comment.postid);
  }

  return (
    <Box backgroundColor={'white'} py="4" px="4">
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
        <Flex paddingY={'2'}>
          <Button onClick={toggleRepBox} colorScheme="brand">
            Reply
          </Button>
        </Flex>
        {replyActive && <AddReply />}
      </Box>
      <Flex justifyContent={'center'} gap="4px" flexDirection={'column'}>
        {filterReplies(comments, posts).map((comment) => (
          <Reply comment={comment} key={comment.id} />
        ))}
      </Flex>
    </Box>
  );
}
