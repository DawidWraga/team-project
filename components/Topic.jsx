import { Box, Button, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';

export function Topic(props) {
  const { topic } = props;
  const { name, numPosts } = topic;
  return (
    <Flex
      backgroundColor={'white'}
      //minW="50vw"
      w="clamp(200px,20vw,750px)"
      minH={'80px'}
      py="2"
      px="4"
      align={'center'}
      rounded="sm"
    >
      <Flex flexDirection={'column'} flexGrow="1">
        <Text
          as={Link}
          _hover={{
            textColor: 'blue.500',
          }}
          fontSize={'md'}
          fontWeight={'semibold'}
        >
          {name}
        </Text>
        <Text fontSize={'sm'}>{numPosts} posts</Text>
      </Flex>
      <Flex>
        <IconButton
          icon={<ArrowRight />}
          rounded={'lg'}
          colorScheme={'brand'}
        ></IconButton>
      </Flex>
    </Flex>
  );
}
