import { Client } from '@notionhq/client';
import NotionToMarkdown from 'notion-to-md';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// 修正: new を削除し、関数として呼び出す
const n2m = NotionToMarkdown({ notionClient: notion });

export type Post = {
  id: string;
  title: string;
  slug: string;
  date: string;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'is_published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Published Date', direction: 'descending' }],
  });

  return response.results.map((post) => {
    const page = post as PageObjectResponse;

    return {
      id: page.id,
      title:
        page.properties.Title.type === 'title'
          ? page.properties.Title.title[0]?.plain_text || 'No Title'
          : 'No Title',
      slug:
        page.properties.Slug.type === 'rich_text'
          ? page.properties.Slug.rich_text[0]?.plain_text || ''
          : '',
      date:
        page.properties['Published Date'].type === 'date'
          ? page.properties['Published Date'].date?.start || ''
          : '',
    };
  });
};

export const getPostBySlug = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: { equals: slug },
        },
        {
          property: 'is_published',
          checkbox: { equals: true },
        },
      ],
    },
  });

  if (!response.results.length) return null;

  const page = response.results[0] as PageObjectResponse;
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  return {
    title:
      page.properties.Title.type === 'title'
        ? page.properties.Title.title[0]?.plain_text || 'No Title'
        : 'No Title',
    content: mdString.parent,
    date:
      page.properties['Published Date'].type === 'date'
        ? page.properties['Published Date'].date?.start || ''
        : '',
  };
};
