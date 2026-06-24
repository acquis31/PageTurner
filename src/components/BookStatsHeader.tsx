/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookStats } from "../types";
import { BookOpen, CheckCircle, Flame, Star } from "lucide-react";

interface BookStatsHeaderProps {
  stats: BookStats;
}

export default function BookStatsHeader({ stats }: BookStatsHeaderProps) {
  const statItems = [
    {
      id: "stat-active",
      label: "Currently Reading",
      value: stats.currentlyReadingCount,
      icon: BookOpen,
      color: "text-[#4a6b5d] bg-[#4a6b5d]/10",
      description: "Active books on your desk",
    },
    {
      id: "stat-completed",
      label: "Books Completed",
      value: stats.completedCount,
      icon: CheckCircle,
      color: "text-[#c2593f] bg-[#c2593f]/10",
      description: "Finished & reviewed stories",
    },
    {
      id: "stat-pages",
      label: "Pages Flipped",
      value: stats.totalPagesRead.toLocaleString(),
      icon: Flame,
      color: "text-[#dca134] bg-[#dca134]/10",
      description: "Cumulative count of pages read",
    },
    {
      id: "stat-rating",
      label: "Average Rating",
      value: stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} / 5.0` : "—",
      icon: Star,
      color: "text-amber-600 bg-amber-500/10",
      description: "Feedback sentiment across reviews",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-container">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            id={item.id}
            className="bg-white border border-[#e4dec9] rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-sans font-medium text-stone-500 tracking-wider uppercase">
                  {item.label}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                  {item.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-stone-500 font-sans mt-3 border-t border-stone-100 pt-2">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
