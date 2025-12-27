import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  language: string;
  contentHtml?: string;
  coverImage?: string;
  smallImage?: string;
}

export function getSortedPostsData(locale: string): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);

      return {
        slug,
        ...(matterResult.data as Omit<BlogPost, 'slug' | 'contentHtml'>),
      };
    });

  // Filter by language (optional: or show all if we want bilingual blog)
  // For now, let's show all or filter if 'language' frontmatter matches
  const filteredPosts = allPostsData.filter(post => {
      // If post has language field, filter by it. If not, assume 'en' or show all.
      // Let's assume strict filtering if language is present.
      if (post.language) {
          return post.language === locale;
      }
      return true; // Show posts without explicit language in both? Or default to English?
  });

  return filteredPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as Omit<BlogPost, 'slug' | 'contentHtml'>),
  };
}

