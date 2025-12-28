"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Github, Linkedin, Mail} from 'lucide-react';
import { trackEvent } from '@/lib/mixpanel';
import { useEffect, useState } from 'react';
import { getPersonalData, PersonalData } from '@/lib/firestore';
import { Achievements } from '@/components/Achievements';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbData = await getPersonalData();
        if (dbData) {
          setData(dbData);
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSocialClick = (platform: string, url: string) => {
    trackEvent("Social Link Clicked", {
      platform,
      url,
      section: "Footer"
    });
  };

  return (
    <footer className="border-t-3 border-ink mt-32 bg-white dark:bg-card">
      <div className="container mx-auto px-5 py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-heading font-black text-4xl uppercase tracking-tight w-fit">
              {loading ? (
                 <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
              ) : (
                 data?.logoText || "Portfolio."
              )}
            </Link>
            {loading ? (
               <div className="h-20 w-64 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
            ) : (
            <p className="max-w-xs text-muted-foreground font-medium text-lg leading-relaxed">
                 {data?.tagline || ""}
            </p>
            )}
            
            <div className="pt-2">
              <Achievements />
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-6 md:items-center">
             <div className="flex flex-col gap-4">
               <h3 className="font-heading font-black text-lg uppercase tracking-wide">Menu</h3>
               <nav className="flex flex-col gap-3">
                  <Link href="/" className="hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide w-fit">{navT('home')}</Link>
                  <Link href="/projects" className="hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide w-fit">{navT('projects')}</Link>
                  <Link href="/blog" className="hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide w-fit">{navT('blog')}</Link>
                  <Link href="/contact" className="hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide w-fit">{navT('contact')}</Link>
               </nav>
             </div>
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-black text-lg uppercase tracking-wide md:text-right">Social</h3>
              <div className="flex gap-4">
                 {data?.socials?.email && (
                 <a
                    href={`mailto:${data.socials.email}`}
                    className="group p-3 border-2 border-ink rounded-full hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-200 shadow-[3px_3px_0px_var(--ink-black)] hover:shadow-[5px_5px_0px_var(--ink-black)] bg-white dark:bg-black text-ink"
                    aria-label="Email"
                    onClick={() => handleSocialClick('Email', `mailto:${data.socials.email}`)}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  )}
                  {data?.socials?.linkedin && (
                  <a
                    href={data.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 border-2 border-ink rounded-full hover:bg-[#0077b5] hover:text-white hover:-translate-y-1 transition-all duration-200 shadow-[3px_3px_0px_var(--ink-black)] hover:shadow-[5px_5px_0px_var(--ink-black)] bg-white dark:bg-black text-ink"
                     aria-label="LinkedIn"
                     onClick={() => handleSocialClick('LinkedIn', data.socials.linkedin)}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  )}
                  {data?.socials?.github && (
                  <a
                    href={data.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 border-2 border-ink rounded-full hover:bg-[#333] hover:text-white hover:-translate-y-1 transition-all duration-200 shadow-[3px_3px_0px_var(--ink-black)] hover:shadow-[5px_5px_0px_var(--ink-black)] bg-white dark:bg-black text-ink"
                     aria-label="GitHub"
                     onClick={() => handleSocialClick('GitHub', data.socials.github)}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            {loading ? (
               <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
            ) : (
               <p>© {currentYear} {data?.fullName || "Portfolio Owner"}. {t('rights')}</p>
            )}
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-xs font-bold">
              {navT('privacy')}
            </Link>
          </div>
          <p className="text-muted-foreground">{t('built_with')}</p>
        </div>
      </div>
    </footer>
  );
}
