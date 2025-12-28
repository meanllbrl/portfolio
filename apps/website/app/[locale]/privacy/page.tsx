import { useTranslations } from 'next-intl';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy');

  return (
    <div className="container mx-auto px-5 py-20 max-w-4xl min-h-screen flex flex-col">
      <article className="flex-grow">
        <h1 className="font-heading font-black text-4xl md:text-5xl mb-12 uppercase tracking-tight">
          {t('title')}
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 font-medium">
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('intro')}
          </p>

          <div className="card bg-paper dark:bg-zinc-900/50 p-8 border-3 border-ink shadow-hard">
            <h2 className="font-heading font-black text-2xl uppercase mb-4 tracking-tight">
              {t('no_personal_data')}
            </h2>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-black text-2xl uppercase tracking-tight">
              {t('analytics_title')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('analytics_text')}
            </p>
          </div>

          <div className="pt-8 border-t-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-muted-foreground italic">
              {t('contact_text')}
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

