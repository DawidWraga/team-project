import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import QuillEditor from 'components/QuillEditor';

export default function DocsPage(props) {
  const [value, setValue] = useState('');

  return (
    <Flex justifyContent="center" marginTop={'8'}>
      <Box width={'75%'} backgroundColor={'gray.100'}>
        <QuillEditor />
      </Box>
    </Flex>
  );
}
