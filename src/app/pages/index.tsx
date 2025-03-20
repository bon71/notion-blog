import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../lib/notion';
import dayjs from 'dayjs';

type Post = {
  id: string;
  title: string;
  slug: string;
  date: string;
};

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h1>Bon Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            <span>{dayjs(post.date).format('YYYY-MM-DD')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();
  return { props: { posts }, revalidate: 60 };
};
