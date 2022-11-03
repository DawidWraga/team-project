import { HStack, Box, Button, Flex, Text, extendTheme } from '@chakra-ui/react';

import topics from 'db/postTopics.json';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#44337A',
      100: '#B794F4',
      500: '#B794F4', // you need this
    },
  },
});

export default function DocsPage(props) {
  const {} = props;

  return (
    //HTML BELOW

    <Box>
      <Box w="300px" h="calc(100vh)" bgColor={'blue.800'}>
        {topics.map((topic, i) => (
          //map through JSON

          <HStack //button box
            color="whiteAlpha.900"
            p="4px"
            key={i}
            alignContent="center"
          >
            <Button //topic title button
              p="3"
              variant={'ghost'}
              w="100%"
              h="50px"
              alignSelf={'left'}
              color="whiteAlpha.700"
              fontWeight={'normal'}
              justifyContent="left"
              _hover={{
                //hover button theme
                bg: 'whiteAlpha.200',
                color: 'white',
                fontWeight: 'semibold',
              }}
              _active={{
                //active button theme
                bg: 'whiteAlpha.300',
                transform: 'scale(0.97)',
                borderColor: '#2477b3',
                color: 'white',
              }}
            >
              <Text w="100%" textAlign={'left'}>
                {topic.name}
              </Text>

              {/* numPosts box */}
              <Text
                p="0"
                minW="9ch"
                alignSelf={'right'}
                textAlign={'left'}
                justifyContent="flex-end"
              >
                {topic.numPosts} posts
              </Text>
            </Button>
          </HStack>
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
