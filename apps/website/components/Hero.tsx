"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { personalData as staticPersonalData } from '@/lib/data';
import { getPersonalData, PersonalData } from '@/lib/firestore';
import { Mail, Linkedin, Github, FileText } from 'lucide-react';
import { trackEvent } from '@/lib/mixpanel';

const iconMap: Record<string, any> = {
  FileText,
  Linkedin,
  Github,
  Mail
};

export function Hero() {
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

  if (loading) {
    return (
      <section className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center min-h-[40vh] md:min-h-0">
        <div className="flex-[2] flex flex-col gap-6 items-start w-full md:w-auto">
          <div className="h-16 w-3/4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          <div className="h-24 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          <div className="flex gap-4">
             <div className="h-10 w-24 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
             <div className="h-10 w-24 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          </div>
        </div>
        <div className="flex-1 flex justify-start w-full md:w-auto">
          <div className="w-28 h-36 md:w-44 md:h-56 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-2xl"></div>
        </div>
      </section>
    );
  }

  // Fallback to static data if Firestore data not loaded but loading finished (error case or empty)
  const hero = data || {
    greeting: staticPersonalData.hero.greeting,
    role: staticPersonalData.hero.role,
    description: staticPersonalData.hero.description,
    imageUrl: undefined,
    resumeUrl: undefined,
    socials: { github: "", linkedin: "", email: "" }
  };

  // Build socials array from the new format
  const socials = data?.socials ? [
    data.resumeUrl ? { label: "Resume", href: data.resumeUrl, icon: "FileText", primary: true } : null,
    data.socials.linkedin ? { label: "LinkedIn", href: data.socials.linkedin, icon: "Linkedin" } : null,
    data.socials.github ? { label: "GitHub", href: data.socials.github, icon: "Github" } : null,
    data.socials.email ? { label: "Email", href: `mailto:${data.socials.email}`, icon: "Mail" } : null,
  ].filter(Boolean) : staticPersonalData.socials;

  const roleText = hero.role;

  const handleLinkClick = (label: string, url: string) => {
    trackEvent("Hero Link Clicked", {
      label,
      url,
      section: "Hero"
    });
  };

  return (
    <section className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center min-h-[40vh] md:min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex-[2] flex flex-col gap-6 items-start w-full md:w-auto">
        <h1 className="font-heading font-black text-5xl md:text-6xl">
          {hero.greeting}
        </h1>
        <h2 className="text-xl md:text-2xl font-medium font-heading text-muted-foreground">
          {roleText}
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-medium">
          {hero.description}
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          {socials.map((social: any) => {
            if (!social) return null;
            const Icon = iconMap[social.icon] || FileText;
            if (social.primary) {
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border-2 border-transparent dark:border-white/10 hover:border-black dark:hover:border-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all font-bold text-sm text-gray-900 dark:text-white shadow-sm"
                  onClick={() => handleLinkClick(social.label, social.href)}
                >
                  <Icon className="w-4 h-4" />
                  {social.label}
                </a>
              );
            }
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : "_blank"}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#0077b5] transition-colors"
                onClick={() => handleLinkClick(social.label, social.href)}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </div>
      </div>
        <div className="flex-1 flex justify-start relative w-full md:w-auto">
          <div className="relative w-28 h-36 md:w-44 md:h-56">
            <div className="absolute inset-0 bg-secondary rounded-2xl transform rotate-6 border-3 border-ink shadow-hard z-0"></div>
          <div className="absolute inset-0 bg-gray-200 rounded-2xl transform -rotate-2 border-3 border-ink shadow-hard z-10 overflow-hidden">
            {hero.imageUrl ? (
              <Image
                src={hero.imageUrl}
                alt="Profile"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 176px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg md:text-xl">
                MN
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
