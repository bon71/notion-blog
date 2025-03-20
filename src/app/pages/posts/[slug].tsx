import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug, Post } from '../../lib/notion';
import ReactMarkdown from 'react-markdown';

type PostProps = {
  post: Post & { content: string };
};

export default function PostPage({ post }: PostProps) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}

// Notionからis_published=trueの記事だけを取得し、ページを生成
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  // is_publishedがtrueのslugだけを抽出
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // 未生成ページもアクセス時に自動生成
  };
};

// 各記事の内容を取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60, // 再生成間隔（ISR）
  };
};
