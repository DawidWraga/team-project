import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Button, EmptyState } from '@saas-ui/react';
import { useRouter } from 'next/router';
import { BiConfused } from 'react-icons/bi';
import { MdWarning } from 'react-icons/md';

export default function ErrorPage(props) {
  const {} = props;

  const router = useRouter();

  return (
    <EmptyState
      colorScheme="brand"
      icon={QuestionOutlineIcon}
      title="Page not found"
      description="Please check the URL and try again."
      spacing={0}
      sx={{
        '& .saas-empty-state__body': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
      }}
      actions={
        <>
          <Button
            label="Home"
            colorScheme="brand"
            onClick={() => router.push('/dashboard')}
          />
          <Button label="back" onClick={() => router.back()} />
        </>
      }
    />
  );
}
// "scope": "typescriptreact",
// "scope": "javascript",

interface IProps {}
