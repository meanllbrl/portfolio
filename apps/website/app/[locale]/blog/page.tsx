import { getPosts, getTags } from '@/lib/firestore'; // Import from firestore
import { BlogSearch } from '@/components/BlogSearch';
import { Footer } from '@/components/Footer';

// This is a Server Component
export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getPosts(); // Fetch from Firestore
  const tags = await getTags();

  const t = await import(`@/messages/${locale}.json`).then((m) => m.default.blog);

  return (
    <div className="container mx-auto px-5 py-20 max-w-4xl min-h-screen flex flex-col">
      <div className="flex-grow">
        <h1 className="font-heading font-black text-5xl md:text-6xl mb-12 lowercase">{t.title}</h1>
        <BlogSearch initialPosts={posts} allTags={tags} />
      </div>
      <Footer />
    </div>
  );
}

