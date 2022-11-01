import { useRouter } from 'next/router';
import { posts } from 'db/posts';

export default function ForumPost(props) {
  const {} = props;

  const router = useRouter();
  const { id } = router.query;

  const post = posts.find((item) => +id === item.id);
  if (!post) return <div>No post</div>;

  return <div>{post.title}</div>;
}
