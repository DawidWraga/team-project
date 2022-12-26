import { Box, Text, Flex, Avatar, AvatarGroup, Link, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Paper } from 'components/Paper';

export function Post(props) {
  const { post } = props;
  const { title, name, replies, timesince, usericon, solved, id } = post;
  const router = useRouter();

  return (
    <Paper
      minH={'80px'}
      py="2"
      px="4"
      flexDirection="row"
      justifyContent="center"
      alignItems={'center'}
    >
      <Avatar size={'md'} src={usericon}></Avatar>
      <Flex fontSize={'sm'} flexDirection={'column'} flexGrow="1" padding="2">
        <Box>
          <Text
            onClick={() => router.push(`/forums?topicId=${post.topicId}`)}
            fontSize="sm"
            textColor="grey.100"
            _hover={{
              textDecorationLine: 'underline',
              cursor: 'pointer',
              textColor: 'blue.500',
            }}
            my="0"
          >
            {post.topic}
          </Text>
          <Text
            as={Link}
            onClick={() => {
              router.push('/forums/' + id);
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
        </Box>
        <Flex justifyContent={'flex-start'} alignItems={'center'} gap="4">
          <Text>{name}</Text>
          <Text>{timesince} ago</Text>
          <Tag textColor={'white'} bgColor={solved ? 'green.600' : 'red.300'}>
            {solved ? 'Solved' : 'Unsolved'}
          </Tag>
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
    </Paper>
  );
}
