import { useTranslations } from 'next-intl';
import { Footer } from '@/components/Footer';
import { getPostBySlug } from '@/lib/firestore'; // Import from firestore
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import { ReadTimeTracker } from '@/components/ReadTimeTracker';
import Image from 'next/image';

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug); // Fetch from Firestore
  const t = await import(`@/messages/${locale}.json`).then((m) => m.default.blog);

  if (!post) {
    notFound();
  }

  // Convert markdown content to HTML if needed
  let contentHtml = post.content;
  if (post.content && !post.content.includes('<')) {
    const processedContent = await remark()
      .use(html)
      .process(post.content);
    contentHtml = processedContent.toString();
  }

  return (
    <div className="container mx-auto px-5 py-20 max-w-4xl min-h-screen flex flex-col">
      <ReadTimeTracker type="blog_post" slug={slug} title={post.title} />
      <article className="flex-grow">
        <header className="mb-12 text-center">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {(post.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-bold uppercase tracking-wider rounded-full border border-yellow-200 dark:border-yellow-800">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading font-black text-4xl md:text-5xl mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground font-medium">
            <span>{post.date}</span>
            <span>{post.readTime} {t.read_time}</span>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border-2 border-black dark:border-gray-800 shadow-sm">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-heading prose-headings:font-bold 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:border-3 prose-img:border-ink prose-img:shadow-hard"
          dangerouslySetInnerHTML={{ __html: contentHtml || '' }}
        />
      </article>

      <Footer />
    </div>
  );
}
