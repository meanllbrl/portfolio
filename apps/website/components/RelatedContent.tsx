'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase, GraduationCap, FileText, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RelatedItem {
  id: string;
  title: string;
  url?: string;
  slug?: string; // Optional slug for posts and projects
  smallImage?: string;
  coverImage?: string;
  excerpt?: string;
  type: 'project' | 'post' | 'experience' | 'education';
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
}

export function RelatedContent({ items, title = "Related Content" }: RelatedContentProps) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  const handleNavigation = (e: React.MouseEvent, item: RelatedItem) => {
    if (item.type === 'experience' || item.type === 'education') {
      e.preventDefault();
      // Navigate to home with hash
      const hash = `#${item.type}-${item.id}`;
      // If we are already on home, just scroll
      if (window.location.pathname === '/') {
        const element = document.getElementById(`${item.type}-${item.id}`);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/${hash}`);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'project': return <FolderOpen className="w-4 h-4" />;
      case 'post': return <FileText className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'experience': return <Briefcase className="w-4 h-4" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getHref = (item: RelatedItem) => {
    // For projects and posts, always use internal routes (ignore external url)
    switch (item.type) {
      case 'project': {
        // Use slug if available, otherwise use id
        return `/projects/${item.slug || item.id}`;
      }
      case 'post': {
        // Try to extract slug from url if it's an internal URL, otherwise use slug or id
        if (item.slug) {
          return `/blog/${item.slug}`;
        }
        // Extract slug from url if it matches internal blog URL pattern
        if (item.url) {
          const blogMatch = item.url.match(/\/blog\/([^\/]+)/);
          if (blogMatch) {
            return `/blog/${blogMatch[1]}`;
          }
          const postsMatch = item.url.match(/\/posts\/([^\/]+)/);
          if (postsMatch) {
            return `/blog/${postsMatch[1]}`;
          }
        }
        // Fallback to id (getPostBySlug accepts id as fallback)
        return `/blog/${item.id}`;
      }
      case 'experience': return `/#experience-${item.id}`;
      case 'education': return `/#education-${item.id}`;
      default: return item.url || '#';
    }
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-gray-100 dark:border-gray-800">
      <h3 className="font-heading font-black text-2xl uppercase mb-6 tracking-tight text-ink dark:text-white">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={getHref(item)}
            onClick={(e) => handleNavigation(e, item)}
            className="flex items-start gap-4 p-4 rounded-xl border-2 border-transparent bg-gray-50 dark:bg-gray-900/50 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all group"
          >
            <div className="shrink-0 relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              {item.smallImage || item.coverImage ? (
                <Image
                  src={item.smallImage || item.coverImage || ''}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="text-gray-400">
                    {getIcon(item.type)}
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  {item.type}
                </span>
              </div>
              <h4 className="font-bold text-base leading-tight text-ink dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h4>
              {item.excerpt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {item.excerpt}
                </p>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
          </Link>
        ))}
      </div>
    </div>
  );
}

