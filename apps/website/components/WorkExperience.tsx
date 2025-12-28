"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { workExperienceData as staticWork, educationData as staticEdu } from '@/lib/data';
import { getExperiences, getEducations } from '@/lib/firestore';
import { ExternalLink, Globe, ArrowRight } from 'lucide-react';
import { FEATURED_LEVELS } from '@/lib/constants';

export function WorkExperience() {
  const t = useTranslations('work');
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');
  const [workData, setWorkData] = useState<any[]>([]);
  const [eduData, setEduData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Track loaded images for skeleton effect
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check hash on mount to set initial tab
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('education')) {
        setActiveTab('education');
      }
    }

    async function fetchData() {
      setLoading(true);
      try {
        console.log("Fetching experience data from Firestore...");
        const [dbWork, dbEdu] = await Promise.all([
          getExperiences(),
          getEducations()
        ]);

        setWorkData(dbWork.length > 0 ? dbWork : staticWork);
        setEduData(dbEdu.length > 0 ? dbEdu : staticEdu);
      } catch (error) {
        console.error("Error fetching experience data:", error);
        setWorkData(staticWork);
        setEduData(staticEdu);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle scroll after data load
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.location.hash) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [loading, activeTab]);

  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full">
      <div className="flex w-full bg-gray-100 dark:bg-card-bg rounded-lg p-1 mb-6 border-2 border-transparent">
        <button
          onClick={() => setActiveTab('work')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'work' ? 'bg-white dark:bg-ink text-black dark:text-background shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
        >
          {t('title')}
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'education' ? 'bg-white dark:bg-ink text-black dark:text-background shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
        >
          {t('education')}
        </button>
      </div>
      <div className="card p-0 overflow-hidden border-2 bg-white dark:bg-black">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (activeTab === 'work' ? workData : eduData).length === 0 ? (
          <div className="p-6 text-center text-gray-500">No {activeTab === 'work' ? 'work experience' : 'education'} data available.</div>
        ) : (
          <div className="divide-y-2 divide-gray-100 dark:divide-gray-800">
            {(activeTab === 'work' ? workData : eduData).map((item: any, index: number) => (
              <div 
                key={item.id || index} 
                id={`${activeTab === 'work' ? 'experience' : 'education'}-${item.id}`}
                className="p-6 flex flex-col md:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors scroll-mt-24"
              >
                {/* Image Section */}
                <div className="shrink-0">
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 ${item.image && !imagesLoaded[item.id] ? 'animate-pulse bg-gray-200 dark:bg-gray-800' : ''}`}>
                    {item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.company || item.school}
                          fill
                          className={`object-cover transition-opacity duration-300 ${imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => handleImageLoad(item.id)}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-xl">
                        {(item.company || item.school || "").charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg">{item.company || item.school}</h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {item.role || item.degree}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {item.period}
                    </span>
                  </div>
                  {item.gpa && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      GPA: {item.gpa}
                    </p>
                  )}

                  {/* Description with Markdown */}
                  {activeTab === 'work' && item.description && (
                    <div className="mt-3 text-sm text-muted-foreground prose dark:prose-invert max-w-none prose-sm prose-ul:list-disc prose-ul:pl-4 prose-p:my-1">
                      <ReactMarkdown>
                        {Array.isArray(item.description)
                          ? item.description.join('\n\n')
                          : String(item.description)}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* URLs */}
                  {((item.urls && item.urls.length > 0) || (item.relatedProjects && item.relatedProjects.length > 0)) && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {/* Standard URLs */}
                      {item.urls?.map((link: any, i: number) => (
                        <a
                          key={`url-${i}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors group"
                        >
                          {link.icon ? (
                            <div className="w-4 h-4 rounded-full overflow-hidden relative">
                              <Image src={link.icon} alt="Icon" fill className="object-cover" />
                            </div>
                          ) : (
                            <Globe className="w-3.5 h-3.5" />
                          )}
                          <span>{link.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}

                      {/* Related Projects (Featured Only, Sorted by sortOrder) */}
                      {item.relatedProjects?.filter((p: any) => p.featured >= FEATURED_LEVELS.STANDARD)
                        .sort((a: any, b: any) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
                        .map((project: any, i: number) => (
                          <a
                            key={`proj-${i}`}
                            href={`/projects/${project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors group"
                          >
                            {project.smallImage ? (
                              <div className="w-4 h-4 rounded-full overflow-hidden relative">
                                <Image src={project.smallImage} alt="Icon" fill className="object-cover" />
                              </div>
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                            <span>Project: {project.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
