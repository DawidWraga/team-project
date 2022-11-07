import { Box, Text, Flex, Avatar, AvatarGroup, Link, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Paper } from 'styles/Paper';


export function Reply(props) {
  const { comment } = props;
  const { usericon, name, postdate, desc, id, solution, postid} = comment;
  const router = useRouter();

  return (
    <Paper
      py="2"
      px="3"
      
    >
      <Avatar size={'sm'} src={usericon}></Avatar>
      <Flex flexDirection={'column'} w="100%">
        <Flex fontSize={'sm'} flexDirection={'row'} pl={'2'}>
          <Text pr="1" fontSize={'xs'} noOfLines={1}>
            {name}
          </Text>
          <Text textColor={'gray.500'} fontSize={'xs'}>
            · {postdate} days ago
          </Text>
          <Spacer/>
              <Text fontSize={'xs'} bg='green' color={'white'}>{ solution ? 'ㅤSolutionㅤ' : ''}</Text>
        </Flex>
          <Flex justifyContent={'left'} alignItems={'left'} flexDirection={'column'}  gap="4" pl={'1'}>
            <Text pl='1' fontSize={'sm'}>{desc}</Text>
          </Flex>
      </Flex>

      
    </Paper>
  );
}
