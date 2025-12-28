"use client";

import {Trophy, TrendingUp, Award} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {getAchievements} from '@/lib/firestore';
import {achievementsData as staticAchievements} from '@/lib/data';
import {toast} from 'sonner';

const iconMap: Record<string, any> = {
  Trophy,
  TrendingUp,
  Award
};

export function Achievements() {
  const t = useTranslations('achievements');
  const [data, setData] = useState<any[]>(staticAchievements);

  useEffect(() => {
    async function fetchData() {
      const dbData = await getAchievements();
      if (dbData.length > 0) setData(dbData);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((item, index) => {
        const Icon = iconMap[item.icon] || Award;
        return (
          <div 
            key={item.id || index} 
            className="group flex items-center gap-2 px-3 py-2 bg-white dark:bg-card border-2 border-ink rounded cursor-pointer hover:-translate-y-1 transition-all shadow-[2px_2px_0px_var(--ink-black)] hover:shadow-[4px_4px_0px_var(--ink-black)] active:translate-y-0 active:shadow-none"
            onClick={() => toast.success(item.title, {
              description: item.description,
              duration: 4000,
            })}
          >
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-xs uppercase tracking-tight">{item.title}</span>
          </div>
        );
      })}
    </div>
  );
}

