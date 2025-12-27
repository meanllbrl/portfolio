"use client";

import {Trophy, TrendingUp, Award} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {getAchievements} from '@/lib/firestore';
import {achievementsData as staticAchievements} from '@/lib/data';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {data.map((item, index) => {
        const Icon = iconMap[item.icon] || Award;
        return (
          <div key={item.id || index} className="card p-6 flex items-start gap-6 hover:-translate-y-1 transition-transform">
            <div className="p-4 rounded-full border-2 border-ink bg-gray-100 dark:bg-gray-800">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

