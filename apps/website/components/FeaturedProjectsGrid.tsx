'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/firestore';
import { Link } from '@/i18n/navigation';

interface FeaturedProjectsGridProps {
  projects: Project[];
}

export function FeaturedProjectsGrid({ projects }: FeaturedProjectsGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no projects, return null
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`
              ${isExpanded ? 'block' : ''}
              ${!isExpanded && index < 3 ? 'block' : ''}
              ${!isExpanded && index === 3 ? 'hidden md:block' : ''}
              ${!isExpanded && index >= 4 ? 'hidden' : ''}
            `}
          >
            <ProjectCard
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              tags={project.tags}
              slug={project.slug || project.id}
              image={project.image}
              link={project.link}
              githubUrl={project.githubUrl}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center flex-col items-center gap-4">
        {!isExpanded && (
          <div className={`
            ${projects.length <= 3 ? 'hidden' : ''}
            ${projects.length === 4 ? 'block md:hidden' : ''}
            ${projects.length > 4 ? 'block' : ''}
          `}>
            <button
              onClick={() => setIsExpanded(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              See More Featured Projects
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {isExpanded && (
          <Link 
            href="/projects" 
            className="group flex items-center gap-2 px-6 py-3 bg-ink text-white dark:text-black border-2 border-ink rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-sm"
          >
            See All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}

