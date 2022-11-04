import { Box, Flex, Text } from '@chakra-ui/react';
import posts from 'db/posts';
import { topics } from 'db/topics';
import { Post } from 'components/Post';
import { Topic } from 'components/Topic';
import { AddPostForm } from 'components/AddPostForm';

export default function ForumsPage(props) {
  const {} = props;
  // const [formActive, setFormActive] = useState(false);

  // function toggleForm() {
  //   setFormActive((formActive) => !formActive);
  // }

  return (
    <Flex
      gap={'20px'}
      padding={'10px'}
      w="100%"
      bgColor={'gray.200'}
      height="100vh"
    >
      <Flex gap={'5px'} flexDirection={'column'}>
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
      </Flex>
      <Flex gap={'5px'} flexDirection={'column'}>
        <Text
          backgroundColor={'white'}
          w="clamp(350px,60vw,750px)"
          py="2"
          px="4"
          rounded="sm"
          fontSize={'xl'}
          fontWeight={'semibold'}
        >
          Posts
        </Text>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Flex>
      {/* <Button onClick={toggleForm}>Show/Hide form</Button> }
      {formActive && <AddPostForm />} */}
      <AddPostForm />
    </Flex>
  );
}
