import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { posts } from 'db/posts';
import { Post } from 'components/Post';
import { HiPlus as Plus } from 'react-icons/hi';
// import Button from './Button';

export default function ForumsPage(props) {
  const {} = props;
  // const [formActive, setFormActive] = useState(false);

  // function toggleForm() {
  //   setFormActive((formActive) => !formActive);
  // }

  const { isOpen, onOpen, onClose, onPost } = useDisclosure();

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
      <IconButton
        onClick={onOpen}
        colorScheme={'brand'}
        icon={<Plus />}
        position={'fixed'}
        bottom={'10'}
        right={'10'}
      />
      <Modal
        size={'xl'}
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>InputGoesHere</ModalBody>
          <ModalFooter>
            <Button onClick={onPost} colorScheme={'brand'}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
