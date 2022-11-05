import { Box, Text, Flex, Avatar, AvatarGroup, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function Reply(props) {
  const { comment } = props;
  const { usericon, name, postdate, desc, id, solution, postid} = comment;
  const router = useRouter();

  return (
    <Flex
      backgroundColor={'white'}
      py="2"
      px="4"
      align={'center'}
      rounded="sm"
      borderWidth='2px'
    >
      <Avatar size={'md'} src={usericon}></Avatar>
      <Flex fontSize={'sm'} flexDirection={'column'} flexGrow="1" padding="2">
        <Text fontSize={'md'} noOfLines={1}>
          {name}
        </Text>
        <Flex justifyContent={'left'} alignItems={'center'} gap="4">
          <Text fontWeight={"semibold"}>{desc}</Text>
          <Text>Posted: {postdate}</Text>
          <Flex backgroundColor={'green'}>
            <Text color={'white'} >{solution ? 'Solution' : ''}</Text>
          </Flex>
          
        </Flex>
      </Flex>
    </Flex>
  );
}
