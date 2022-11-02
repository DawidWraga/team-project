import {
  Box,
  ButtonGroup,
  Button,
  Center,
  Image,
  Heading,
  Text,
  Flex,
  Avatar,
  AvatarGroup,
  Link,
} from '@chakra-ui/react';
import { title } from 'process';
import { toast } from 'react-toastify';
import { posts } from 'db/posts';
import { useRouter } from 'next/router';
// import Button from './Button';

export default function ForumsPage(props) {
  const {} = props;

  function Post(props) {
    const { post } = props;
    const { title, name, replies, timesince, usericon, solved, id } = post;
    const router = useRouter();

    return (
      <Flex
        backgroundColor={'white'}
        //minW="50vw"
        w="clamp(350px,80vw,750px)"
        minH={'80px'}
        py="2"
        px="4"
        align={'center'}
        rounded="sm"
      >
        <Avatar size={'md'} src={usericon}></Avatar>
        <Flex fontSize={'sm'} flexDirection={'column'} flexGrow="1" padding="2">
          <Text
            as={Link}
            onClick={() => {
              router.push('/forums/' + id);
              console.log('test');
            }}
            _hover={{
              textColor: 'blue.500',
            }}
            fontWeight={'semibold'}
            fontSize={'md'}
            noOfLines={1}
          >
            {title}
          </Text>
          <Flex justifyContent={'left'} alignItems={'center'} gap="4">
            <Text>{name}</Text>
            <Text>{timesince} ago</Text>
            <Text>{solved ? 'Solved' : 'Unsolved'}</Text>
          </Flex>
        </Flex>
        <Box align="center">
          <AvatarGroup size={'sm'} max={2}>
            <Avatar src={usericon} />
            <Avatar src={usericon} />
            <Avatar src={usericon} />
          </AvatarGroup>
          <Text fontSize={'sm'}>{replies} replies</Text>
        </Box>
      </Flex>
    );
  }

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
    </Flex>
  );
}
