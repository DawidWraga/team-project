import {
  HStack,
  Box,
  Button,
  Flex,
  Text,
  extendTheme,
  Wrap,
  useControllableState,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import topics from 'db/docTopics.json';
import posts from 'db/docPosts.json';

export default function DocsPage(props) {
  const {} = props;
  const [currentTopic, setTopic] = useControllableState({
    defaultValue: 'printing',
  });

  function Listdocs(props) {
    const {} = props;
    const requestedTopic = props.topic;

    return (
      <Box>
        {posts.map((post) => {
          if (post.topic == requestedTopic) {
            return <Text>{post.title}</Text>;
          }
        })}
      </Box>
    );
  }

  return (
    //HTML BELOW

    <Wrap>
      <Box //sidebar box
        w="300px"
        h="calc(100vh)"
        bgColor={'blue.800'}
      >
        {topics.map((topic, i) => (
          //map through JSON

          <Box //individual button box
            color="whiteAlpha.900"
            p="4px"
            key={i}
            alignContent="center"
          >
            <Button
              //topic title button
              onClick={() => setTopic(topic.name)}
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
          </Box>
        ))}
      </Box>

      <Box>
        <Listdocs topic={currentTopic}></Listdocs>
      </Box>
    </Wrap>
  );
}
