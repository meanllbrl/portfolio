"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MouseEvent, useEffect, useState } from 'react';
import { getPersonalData, PersonalData } from '@/lib/firestore';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If we are on the homepage, scroll to top
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] z-50">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-3 border-ink rounded-full px-6 py-3 shadow-hard flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-black text-xl tracking-tight hover:scale-105 transition-transform"
          onClick={handleHomeClick}
        >
          {loading ? (
            <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
          ) : (
            data?.logoText || "Portfolio."
          )}
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium text-sm">
          <Link href="/" className="hover:text-primary transition-colors" onClick={handleHomeClick}>{t('home')}</Link>
          <Link href="/projects" className="hover:text-primary transition-colors">{t('projects')}</Link>
          <Link href="/blog" className="hover:text-primary transition-colors">{t('blog')}</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full mt-4 bg-white/95 dark:bg-black/95 backdrop-blur-md border-3 border-ink rounded-3xl shadow-hard p-6 flex flex-col items-center gap-6 md:hidden">
          <Link
            href="/"
            className="text-lg font-heading font-bold hover:text-primary transition-colors"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleHomeClick(e); setIsMenuOpen(false); }}
          >
            {t('home')}
          </Link>
          <Link
            href="/projects"
            className="text-lg font-heading font-bold hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('projects')}
          </Link>
          <Link
            href="/blog"
            className="text-lg font-heading font-bold hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('blog')}
          </Link>
          <Link
            href="/contact"
            className="text-lg font-heading font-bold hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('contact')}
          </Link>
        </div>
      )}
    </nav>
  );
}
