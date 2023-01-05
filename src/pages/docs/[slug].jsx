import { Avatar, Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { getDocBySlug, markdownToHtml, getAllDocs } from 'lib-client/controllers/docs';
import { useRouter } from 'next/router';
import { Paper } from 'components/Paper';
import { PageWrapper } from 'layouts/PageWrapper';
import markdownStyles from 'styles/markdownStyles.module.css';
import moment from 'moment/moment';
import { MdShare } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function IndividualDocPage(props) {
  const { doc } = props;

  const router = useRouter();

  if (!doc.slug && !router.isFallback) return <>page not found</>;

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
              <Avatar src={doc.author.img} w="2rem" h="2rem" />
              <Text fontSize="1.2rem" fontWeight="semibold">
                {doc.author.name}
              </Text>
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

export const getStaticProps = async (ctx) => {
  const doc = await getDocBySlug(ctx.params.slug, [
    'title',
    'date',
    'author',
    'slug',
    'content',
  ]);
  const content = await markdownToHtml(doc.content || '');

  return {
    props: { doc: { ...doc, content } },
  };
};

export const getStaticPaths = async (ctx) => {
  const docs = getAllDocs(['slug']);

  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: doc.slug,
        },
      };
    }),
    fallback: false,
  };
};