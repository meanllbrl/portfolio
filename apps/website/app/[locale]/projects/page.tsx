import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectSearch } from '@/components/ProjectSearch'; // Import new component
import { Footer } from '@/components/Footer';
import { projectsData } from '@/lib/data';
import { getProjects } from '@/lib/firestore';

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  let projects = await getProjects();
  if (projects.length === 0) {
    projects = projectsData;
  }

  // Aggregate all unique tags from the projects
  const allTags = Array.from(new Set(projects.flatMap((p: any) => p.tags || []))).sort();

  return (
    <div className="container mx-auto px-5 py-20 max-w-4xl min-h-screen flex flex-col">
      <div className="flex-grow">
        <h1 className="font-heading font-black text-5xl md:text-6xl mb-12 lowercase">{t('projects')}</h1>
        <ProjectSearch initialProjects={projects} allTags={allTags} />
      </div>
      <Footer />
    </div>
  );
}

