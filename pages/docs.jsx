import {
  Box,
  ButtonGroup,
  Button,
  Flex,
  Spacer,
  Center,
  Text,
} from '@chakra-ui/react';
// import Button from './Button';

import topics from 'db/postTopics.json';

export default function DocsPage(props) {
  const {} = props;

  return (
    //HTML BELOW

    <Box>
      <Box>
        {topics.map((topic) => (
          //map through JSON

          <Flex
            bgColor="blue.800"
            color="whiteAlpha.900"
            p="3px"
            maxW="200px"
            gap="3"
          >
            <Button
              p="3"
              w="100%"
              h="100%"
              textAlign={'left'}
              alignSelf={'center'}
              variant={'ghost'}
              colorScheme={'whiteAlpha'}
              color="white"
            >
              <Text mr={'auto'} textAlign="left">
                {topic.name}
              </Text>
            </Button>

            {/* numPosts box */}
            <Box
              p="1"
              minW="3ch"
              bg=""
              color="whiteAlpha.900"
              alignSelf={'center'}
              textAlign={'center'}
            >
              {topic.numPosts}
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

// create card
// have props
// loop through cards-assign diff titles to each one

// make a json inside db
// loop thru json
// create compnents using chakra
// pass topic name inside props
