import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ThemeProvider} from '@/components/ThemeProvider';
import {Navigation} from '@/components/Navigation';
import {MixpanelProvider} from '@/components/MixpanelProvider';
import {Suspense} from 'react';

import {getPersonalData} from '@/lib/firestore';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPersonalData();
  return {
    title: data?.fullName ? `${data.fullName} | ${data.role}` : "Portfolio",
    description: data?.tagline || "Portfolio",
    icons: {
      icon: '/favicon.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!['en', 'tr'].includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale} className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Suspense fallback={null}>
              <MixpanelProvider />
            </Suspense>
            <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
              <Navigation />
              <main className="flex-grow pt-24">
                {children}
              </main>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

