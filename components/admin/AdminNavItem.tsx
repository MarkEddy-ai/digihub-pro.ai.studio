'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminNavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number | string | null;
  badgeVariant?: 'yellow' | 'red' | 'orange' | 'green' | 'blue' | 'purple';
}

export function AdminNavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  badge,
  badgeVariant = 'yellow',
}: AdminNavItemProps) {
  const badgeClasses = {
    yellow: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    blue: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
        isActive
          ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-500 shadow-sm'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 transition-colors ${
            isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
          }`}
        />
        <span className="truncate">{label}</span>
      </div>

      {badge !== undefined && badge !== null && (
        <span
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${badgeClasses[badgeVariant]}`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
