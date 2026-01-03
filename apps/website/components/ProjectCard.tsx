"use client";

import { Link } from '@/i18n/navigation';
import { ArrowRight, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@/lib/mixpanel';

interface ProjectCardProps {
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  slug?: string;
  image?: string;
  link?: string;
  githubUrl?: string;
}

export function ProjectCard({
  title,
  subtitle,
  description,
  tags = [],
  slug,
  image,
  link,
  githubUrl
}: ProjectCardProps) {
  const projectLink = `/projects/${slug || '#'}`;

  const handleProjectClick = () => {
    trackEvent("Project Card Clicked", {
      project_title: title,
      project_slug: slug,
      section: "Project List"
    });
  };

  const handleExternalLinkClick = (type: string, url: string) => {
    trackEvent("External Project Link Clicked", {
      project_title: title,
      link_type: type,
      url: url,
    });
  };

  return (
    <div className="block h-full card p-0 overflow-hidden flex flex-col group relative">
      <Link href={projectLink} className="contents" onClick={handleProjectClick}>
        {/* Image Placeholder area */}
        <div className="h-48 bg-gray-100 dark:bg-gray-900 border-b-3 border-ink flex items-center justify-center relative overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 960px) 416px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 transition-transform group-hover:scale-105"></div>
              <span className="relative z-10 font-black text-4xl text-gray-300 dark:text-gray-700 uppercase tracking-tighter">
                {title.substring(0, 2)}
              </span>
            </>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow bg-white dark:bg-card">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-2xl mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                {subtitle}
              </p>
            )}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-3 prose dark:prose-invert prose-p:my-0 prose-headings:my-0">
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Buttons moved outside the Link but inside the card container's bottom padding */}
      <div className="px-6 pb-6 flex gap-3 mt-auto bg-white dark:bg-card">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-ink text-background border-2 border-ink rounded text-xs font-bold hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_#888] dark:hover:shadow-[2px_2px_0px_#fff] transition-all z-10 relative"
            onClick={(e) => {
              e.stopPropagation();
              handleExternalLinkClick('Website', link);
            }}
          >
            <Globe className="w-3 h-3" /> Website
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 border-2 border-ink text-ink dark:text-white rounded text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors z-10 relative"
            onClick={(e) => {
              e.stopPropagation();
              handleExternalLinkClick('Source', githubUrl);
            }}
          >
            <Github className="w-3 h-3" /> Source
          </a>
        )}

        <Link
          href={projectLink}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors z-10 relative"
          onClick={handleProjectClick}
        >
          Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
