import {} from '@chakra-ui/react';
import React, { useState } from 'react';
import QuillEditor from 'components/QuillEditor';

export default function DocsPage(props) {
  const [value, setValue] = useState('');

  return (
    <>
      <QuillEditor />
    </>
  );
}
