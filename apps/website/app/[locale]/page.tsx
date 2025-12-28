import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { WorkExperience } from '@/components/WorkExperience';
import { RecentPosts } from '@/components/RecentPosts';
import { Footer } from '@/components/Footer';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { getSortedPostsData } from '@/lib/posts';
import { projectsData } from '@/lib/data';
import { getProjects, getPosts } from '@/lib/firestore'; // Import getPosts
import { FEATURED_LEVELS } from '@/lib/constants';

import { Recommendations } from '@/components/Recommendations';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = (await getPosts()).slice(0, 3); // Fetch from Firestore

  // Try to get projects from Firestore, fallback to static data
  let projects = await getProjects();
  if (projects.length === 0) {
    projects = projectsData;
  }
  const featuredProjects = projects.filter((p: any) => p.featured >= FEATURED_LEVELS.FEATURED);

  return (
    <div className="container mx-auto px-5 py-8 md:py-12 max-w-4xl space-y-16 md:space-y-24">
      <Hero />
      <section id="experience" className="scroll-mt-24">
        <WorkExperience />
      </section>
      <section id="projects" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-black text-3xl md:text-4xl lowercase text-ink">
            featured projects
          </h2>
          <Link href="/projects" className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            view more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project: any) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              tags={project.tags}
              slug={project.slug || project.id}
              image={project.image}
              link={project.link}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>
      </section>
      <section id="blog" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-black text-3xl md:text-4xl lowercase text-ink">
            recent posts
          </h2>
          <Link href="/blog" className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            view more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <RecentPosts posts={posts} />
      </section>
      
      <Recommendations />

      <Footer />
    </div>
  );
}

