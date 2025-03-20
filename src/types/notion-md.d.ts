declare module 'notion-md' {
    import { Client } from '@notionhq/client';

    class NotionToMarkdown {
      constructor(params: { notionClient: Client });
      pageToMarkdown(pageId: string): Promise<{ parent: string }>;
      toMarkdownString(mdBlocks: unknown): { parent: string }; // ✅ `unknown` に変更
    }

    export default NotionToMarkdown;
  }
