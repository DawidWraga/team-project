import { controller } from 'lib-client/controllers';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Text,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { Paper } from 'components/Paper';
import { PageWrapper } from 'layouts/PageWrapper';
import markdownStyles from 'styles/markdownStyles.module.css';
import moment from 'moment/moment';
import { MdArrowLeft, MdShare } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Loader, EmptyState } from '@saas-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';

interface IProps {}

export default function SingleDocumentPage(props: IProps) {
  const {} = props;

  const router = useRouter();
  const { id: docId } = useUrlData('dynamicPath');

  const { data: doc, isLoading } = controller.useQuery({
    model: 'document',
    query: 'findUnique',
    prismaProps: {
      where: {
        id: docId,
      },
      include: {
        authors: true,
        tags: true,
      },
    },
    enabled: Boolean(docId),
  });

  if (isLoading) return <Loader />;
  if (!doc?.id) return <EmptyDocState />;

  return (
    <>
      <PageWrapper>
        <Paper
          as="article"
          variant="elevated"
          p="5"
          flexDir="column"
          gap="8"
          position="relative"
        >
          <IconButton
            aria-label="back to docs"
            icon={<MdArrowLeft />}
            top={2}
            left={2}
            position="absolute"
            onClick={() => router.back()}
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText('makeitall.vercel.app' + router.asPath);
              toast.success('Link copied!');
            }}
            leftIcon={<MdShare />}
            position="absolute"
            top="2"
            right="2"
          >
            Share
          </Button>
          <Heading mx="auto" size="lg" mt="5">
            {doc.title}
          </Heading>
          <Spacer w="100%" h="1" border="1px solid gray" />
          <Flex alignItems="center" justifyContent={'space-between'}>
            <Flex alignItems="center" gap="1">
              <CustomAvatarGroup users={doc.authors} />
              {/* <Avatar src={doc.author.img} w="2rem" h="2rem" /> */}
              {/* <Text fontSize="1.2rem" fontWeight="semibold">
                {doc.author.name}
              </Text> */}
            </Flex>
            <Text>{moment(doc.date).format('DD/MM/YYYY')}</Text>
          </Flex>
          <div
            className={markdownStyles['markdown']}
            dangerouslySetInnerHTML={{ __html: doc.content }}
          ></div>
        </Paper>
      </PageWrapper>
    </>
  );
}

const EmptyDocState = () => {
  const router = useRouter();
  return (
    <EmptyState
      colorScheme="brand"
      icon={QuestionOutlineIcon}
      title="Doc not found"
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
          <Button colorScheme="brand" onClick={() => router.push('/dashboard')}>
            Home
          </Button>
          <Button onClick={() => router.back()}>Back</Button>
        </>
      }
    />
  );
};
