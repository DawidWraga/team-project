import { Box } from '@chakra-ui/react';

export const DragDownIndicator = () => {
  return (
    <Box
      opacity={{ base: 1, md: 0 }}
      bgColor="shade.min"
      w="2.4rem"
      h="3px"
      rounded="xl"
      position="absolute"
      top="2"
      left="calc(50% - 1rem)"
      mb="10"
    />
  );
};
