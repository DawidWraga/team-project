import { Flex } from '@chakra-ui/react';
import { posts } from 'db/posts';
import { Post } from 'components/Post';
import { AddPostForm } from 'components/AddPostForm';
// import Button from './Button';

export default function ForumsPage(props) {
  const {} = props;
  // const [formActive, setFormActive] = useState(false);

  // function toggleForm() {
  //   setFormActive((formActive) => !formActive);
  // }

  return (
    <Flex
      gap={'5px'}
      padding={'10px'}
      flexDirection={'column'}
      alignItems={'center'}
      w="100%"
      bgColor={'gray.200'}
      height="100vh"
    >
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {/* <Button onClick={toggleForm}>Show/Hide form</Button> }
      {formActive && <AddPostForm />} */}
      <AddPostForm />
    </Flex>
  );
}
