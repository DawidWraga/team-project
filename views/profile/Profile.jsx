import { Flex } from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';

export default function Profile(props) {
  const {} = props;

  return (
    <>
      <Flex _hover={{ textColor: 'brand.500' }} gap="10px">
        <MdEmail fontSize={'22'} color="brand.500"></MdEmail>
        <Flex
          as="a"
          _hover={{ textColor: 'brand.500' }}
          flexDirection={'column'}
          href="mailto:JohnSmith@MakeItAll.org.uk"
        >
          JohnSmith@MakeItAll.org.uk
        </Flex>
      </Flex>
    </>
  );
}
