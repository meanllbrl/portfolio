import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/posts';
import Image from 'next/image';

interface RecentPostsProps {
  posts: BlogPost[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="card p-0 border-2 bg-white dark:bg-black divide-y-2 divide-gray-100 dark:divide-gray-800">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors group"
        >
          <div className="flex gap-4">
            {post.smallImage && (
              <div className="shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 mt-1">
                <Image
                  src={post.smallImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="text-xs text-gray-400 text-right shrink-0 ml-4">
                  <div>{post.date}</div>
                  <div>{post.readTime} min read</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 max-w-[90%]">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2">
                {(post.tags || []).slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-gray-500 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}







