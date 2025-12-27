"use client";

import {useTranslations} from 'next-intl';
import {Mail, Linkedin, Github} from 'lucide-react';
import {Footer} from '@/components/Footer';
import { TrackLink } from '@/components/TrackLink';
import { useEffect, useState } from 'react';
import { getPersonalData, PersonalData } from '@/lib/firestore';

export default function ContactPage() {
  const t = useTranslations('contact');
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

  return (
    <div className="container mx-auto px-5 py-20 max-w-[800px] min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-center">
        <h1 className="heading-hero mb-6">{t('title')}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
          {t('subtitle')}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 animate-pulse bg-gray-200 dark:bg-zinc-800 h-20"></div>
            <div className="card p-6 animate-pulse bg-gray-200 dark:bg-zinc-800 h-20"></div>
            <div className="card p-6 animate-pulse bg-gray-200 dark:bg-zinc-800 h-20 md:col-span-2"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.socials?.email && (
              <TrackLink 
                href={`mailto:${data.socials.email}`} 
                eventName="Contact Link Clicked"
                eventProperties={{ method: "Email", section: "Contact Page" }}
                className="card group flex items-center gap-4 hover:bg-primary hover:text-white transition-colors p-6"
              >
                <Mail className="w-8 h-8 group-hover:text-white transition-colors" />
                <span className="font-heading font-bold text-xl">{t('email_label')}</span>
              </TrackLink>
            )}

            {data?.socials?.linkedin && (
              <TrackLink 
                href={data.socials.linkedin} 
                eventName="Contact Link Clicked"
                eventProperties={{ method: "LinkedIn", section: "Contact Page" }}
                target="_blank" 
                rel="noopener noreferrer"
                className="card group flex items-center gap-4 hover:bg-[#0077b5] hover:text-white transition-colors p-6"
              >
                <Linkedin className="w-8 h-8 group-hover:text-white transition-colors" />
                <span className="font-heading font-bold text-xl">{t('linkedin_label')}</span>
              </TrackLink>
            )}

            {data?.socials?.github && (
              <TrackLink 
                href={data.socials.github} 
                eventName="Contact Link Clicked"
                eventProperties={{ method: "GitHub", section: "Contact Page" }}
                target="_blank" 
                rel="noopener noreferrer"
                className="card group flex items-center gap-4 hover:bg-[#333] hover:text-white transition-colors p-6 md:col-span-2"
              >
                <Github className="w-8 h-8 group-hover:text-white transition-colors" />
                <span className="font-heading font-bold text-xl">{t('github_label')}</span>
              </TrackLink>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
