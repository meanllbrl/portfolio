import { Link } from '@/i18n/navigation';
import { getProjectBySlug } from '@/lib/firestore';
import { ArrowLeft, Github, Globe, Calendar, Check } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Footer } from '@/components/Footer';
import { ProjectGallery } from '@/components/ProjectGallery';
import { ReadTimeTracker } from '@/components/ReadTimeTracker';
import { TrackLink } from '@/components/TrackLink';
import { RelatedContent } from '@/components/RelatedContent';

interface Props {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <ReadTimeTracker type="project" slug={slug} title={project.title} />
            <div className="container mx-auto px-5 py-8 md:py-12 max-w-4xl flex-grow">
                {/* Back Button */}
                <Link
                    href="/#projects"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Projects
                </Link>

                {/* Header */}
                <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight">
                            {project.title}
                        </h1>
                        {project.subtitle && (
                            <p className="text-xl md:text-2xl font-bold text-primary dark:text-primary">
                                {project.subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded font-bold uppercase text-xs tracking-wider text-gray-700 dark:text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Date if available */}
                        {project.date && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <Calendar className="w-4 h-4" />
                                {project.date}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery or Cover Image */}
                {project.gallery && project.gallery.length > 0 ? (
                    <div className="mb-12">
                        <ProjectGallery gallery={project.gallery} />
                    </div>
                ) : (
                    <div className="aspect-video relative rounded-2xl overflow-hidden border-[3px] border-ink shadow-[5px_5px_0px_var(--ink-black)] mb-12 bg-gray-100 dark:bg-gray-800">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                                <span className="font-black text-6xl text-gray-300 dark:text-gray-700">
                                    {project.title.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons & Links */}
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    {/* Primary: Visit Website */}
                    {project.link && (
                        <TrackLink
                            href={project.link}
                            eventName="External Project Link Clicked"
                            eventProperties={{ project_title: project.title, link_type: "Website" }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2.5 bg-ink text-background rounded-lg font-bold text-base hover:opacity-90 transition-opacity border-2 border-transparent shadow-sm"
                        >
                            <Globe className="w-4 h-4" /> Visit Website
                        </TrackLink>
                    )}

                    {/* Secondary: Source Code */}
                    {project.githubUrl && (
                        <TrackLink
                            href={project.githubUrl}
                            eventName="External Project Link Clicked"
                            eventProperties={{ project_title: project.title, link_type: "Source" }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-ink dark:text-gray-200 rounded-lg font-semibold text-sm transition-colors group"
                        >
                            <Github className="w-4 h-4" />
                            <span>Source Code</span>
                        </TrackLink>
                    )}

                    {/* Additional Resources / Links */}
                    {project.urls?.map((link, i) => (
                        <TrackLink
                            key={i}
                            href={link.url}
                            eventName="External Project Link Clicked"
                            eventProperties={{ project_title: project.title, link_type: "Resource: " + link.title }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-ink dark:text-gray-200 rounded-lg font-semibold text-sm transition-colors group"
                        >
                            {link.icon ? (
                                <div className="w-4 h-4 rounded-full overflow-hidden relative">
                                    <Image
                                        src={link.icon}
                                        alt={link.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <Globe className="w-4 h-4" />
                            )}
                            <span>{link.title}</span>
                        </TrackLink>
                    ))}

                    {(!project.link && !project.githubUrl && (!project.urls || project.urls.length === 0)) && (
                        <p className="text-sm text-gray-500 italic">
                            No public links available.
                        </p>
                    )}
                </div>

                {/* Main Content */}
                <MarkdownRenderer content={project.description} className="mb-12" />

                {/* Roadmap Section */}
                {project.roadmap && project.roadmap.length > 0 && (
                    <div className="mt-16 pt-8 border-t-2 border-gray-100 dark:border-gray-800">
                        <h3 className="font-heading font-black text-2xl uppercase mb-6 tracking-tight">Roadmap</h3>
                        <div className="grid gap-4 max-w-lg">
                            {project.roadmap.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 group">
                                    <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-[3px] shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#FAFAFA] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#121212] dark:hover:shadow-[2px_2px_0px_#FAFAFA] ${item.done
                                            ? 'bg-ink dark:bg-primary border-ink dark:border-primary text-background dark:text-ink'
                                            : 'bg-white dark:bg-background border-ink dark:border-white'
                                        }`}>
                                        {item.done && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                    </div>
                                    <span className={`text-lg font-bold leading-tight ${item.done
                                            ? 'text-gray-400 line-through decoration-2 decoration-gray-900 dark:decoration-gray-100'
                                            : 'text-ink dark:text-white'
                                        }`}>
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <RelatedContent 
                    items={[
                        ...(project.relatedPosts || []).map((p: any) => ({ ...p, type: 'post' as const })),
                        ...(project.relatedExperience || []).map((e: any) => ({ ...e, type: 'experience' as const })),
                        ...(project.relatedEducation || []).map((e: any) => ({ ...e, type: 'education' as const })),
                    ]} 
                />
            </div>
            <Footer />
        </div>
    );
}
