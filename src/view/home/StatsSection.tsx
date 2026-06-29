"use client";

import { Star } from "@/src/components/icon";

interface Stat {
  id: number;
  value: string;
  label: string;
  valueColor: string;
  showStar?: boolean;
}

interface StatsSectionProps {
  title: string;
  stats: Stat[];
}

export default function StatsSection({ title, stats }: StatsSectionProps) {
  return (
    <section className="my-8 px-4">
      <h2 className="stats-section-title mx-auto mb-4 block w-fit max-w-full text-center">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex h-[66px] w-full flex-col items-center justify-center rounded-[18px] border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#2a2a3a]"
          >
            <span
              style={{ color: stat.valueColor }}
              className="flex items-center gap-0.5 text-lg font-bold"
            >
              {stat.value}
              {stat.showStar && <Star className="h-3 w-3" />}
            </span>
            <span className="text-center text-xs text-black dark:text-white">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
