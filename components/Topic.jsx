import { Box, Flex } from '@chakra-ui/react';

export function Topic(props) {
  const { topic } = props;
  const { name, numposts } = topic;
  return (
    <Flex
      backgroundColor={'white'}
      //minW="50vw"
      w="clamp(350px,90vw,750px)"
      minH={'80px'}
      py="2"
      px="4"
      align={'center'}
      rounded="sm"
    >
      <Flex>{name}</Flex>
    </Flex>
  );
}
