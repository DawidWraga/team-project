import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { EmptyState } from '@saas-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

interface IProps {
  title?: string;
}

export const CustomEmptyState = (props: IProps) => {
  const { title } = props;
  const router = useRouter();
  return (
    <EmptyState
      colorScheme="brand"
      icon={QuestionOutlineIcon}
      title={title || 'Page not found'}
      description="Please check the URL and try again."
      spacing={0}
      sx={{
        mt: 5,
        '& .saas-empty-state__body': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
      }}
      actions={
        <>
          <Button colorScheme="brand" onClick={() => router.push('/dashboard')}>
            Home
          </Button>
          <Button onClick={() => router.back()}>Back</Button>
        </>
      }
    />
  );
};
