declare module 'notion-md' {
    import { Client } from '@notionhq/client';

    class NotionToMarkdown {
      constructor(params: { notionClient: Client });
      pageToMarkdown(pageId: string): Promise<{ parent: string }>;
      toMarkdownString(mdBlocks: any): { parent: string };
    }

    export default NotionToMarkdown;
  }
