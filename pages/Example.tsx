import { background } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const URL = 'https://jsonplaceholder.typicode.com/posts';

// prop types
interface IProps {
  posts: any[];
}

// server side function

export async function getServerSideProps() {
  const res = await axios(URL);
  const posts = res.data;

  return {
    props: {
      posts,
    },
  };
}

// client side component
export default function ExamplePage(props: IProps) {
  // const { posts } = props;

  const posts = [
    { name: 'test1', status: 'complete' },
    { name: 'test2', status: 'not' },
  ];

  const [view, setView] = useState<'posts' | 'button' | 'square'>('posts');

  const Posts = () => {
    const statusToColorMap = {
      complete: 'green',
      not: 'red',
    };

    return (
      <>
        {posts.map((post) => {
          return (
            <>
              <span style={{ backgroundColor: statusToColorMap[post.status] }}>
                {post.status}
              </span>
              <span>{post.name}</span>
              <br />
            </>
          );
        })}
      </>
    );
  };
  const Button = () => {
    return (
      <>
        <button>hello</button>
      </>
    );
  };

  const viewToComponentMap = {
    posts: <Posts />,
    button: <Button />,
  };

  return (
    <>
      <button onClick={() => setView('posts')}>posts</button>
      <button onClick={() => setView('button')}>button</button>
      <br />
      {viewToComponentMap[view]}
    </>
  );
}
