"use client";

import { Link } from '@/i18n/navigation';
import { BlogPost } from '@/lib/posts';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/lib/mixpanel';
import Image from 'next/image';
import { ExcerptRenderer } from './ExcerptRenderer';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations('blog');

  const handlePostClick = () => {
    trackEvent("Blog Post Clicked", {
      post_title: post.title,
      post_slug: post.slug,
      tags: post.tags,
      section: "Blog List"
    });
  };

  const displayImage = post.coverImage || post.smallImage;

  return (
    <Link href={`/blog/${post.slug}`} className="block group" onClick={handlePostClick}>
      <article className="card p-6 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
        {displayImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border-2 border-black dark:border-white/20">
            <Image
              src={displayImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {(post.tags || []).map(tag => (
            <span key={tag} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-bold uppercase tracking-wider rounded border border-yellow-200 dark:border-yellow-800">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-heading font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <div className="text-muted-foreground mb-6 flex-grow">
          <ExcerptRenderer content={post.excerpt} />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 font-medium border-t border-gray-200 dark:border-gray-800 pt-4 mt-auto">
          <span>{post.date}</span>
          <span>{post.readTime} {t('read_time')}</span>
        </div>
      </article>
    </Link>
  );
}
