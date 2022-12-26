import { Text } from '@chakra-ui/react';
import posts from 'db/posts';
import { Post } from 'views/forum/Post';
import { AddPostForm } from 'views/forum/AddPostForm';
import { useRouter } from 'next/router';
import { PageWrapper } from 'layouts/PageWrapper';
import { Paper } from 'components/Paper';
import { PrismaClient } from '@prisma/client';

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps = async (ctx) => {
// 	const prisma = new PrismaClient();
// 	const posts = await prisma.post.findMany(); // your fetch function here

// 	console.log(posts);

// 	return {
// 		props: { posts },
// 	};
// };

export default function ForumsPage(props) {
  // const {} = props;

  const router = useRouter();

  const topicId = router.query?.topicId;
  const solved = router.query?.filter;

  console.table({ topicId, solved });

  let relevantPosts = [...posts];
  if (topicId)
    relevantPosts = relevantPosts.filter((post) => `${post.topicId}` === topicId);

  switch (solved) {
    case 'solved':
      relevantPosts = relevantPosts.filter((post) => post.solved);
      break;
    case 'unsolved':
      relevantPosts = relevantPosts.filter((post) => !post.solved);
      break;
    default:
      break;
  }

  return (
    <>
      <PageWrapper display="flex" gap="1" flexDir={'column'}>
        <Paper py="2" px="4" mb="2">
          <Text fontSize={'xl'} fontWeight={'semibold'}>
            Posts
          </Text>
        </Paper>
        {relevantPosts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </PageWrapper>
      <AddPostForm />
    </>
  );
}
