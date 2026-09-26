'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { CATEGORIES } from '@/data/categories';
import {
  Sparkles,
  Tv,
  Palette,
  Cpu,
  LayoutGrid,
  Gamepad2,
  ShieldCheck,
  Layers,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Tv,
  Palette,
  Cpu,
  LayoutGrid,
  Gamepad2,
  ShieldCheck,
  Layers,
  FolderArchive,
};

export function CategoryGrid() {
  const { setSelectedCategory, setActiveTab } = useShop();

  const handleCategorySelect = (categoryId: any) => {
    setSelectedCategory(categoryId);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-18 bg-[#0B0F17] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Rayons Officiels
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explorez par catégorie
            </h2>
          </div>
          <button
            onClick={() => handleCategorySelect('all')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Voir l&apos;ensemble du catalogue ({CATEGORIES.reduce((s, c) => s + c.productCount, 0)} produits)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Sparkles;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group relative p-5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-cyan-500/5 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-slate-800/80 group-hover:bg-cyan-950/60 group-hover:text-cyan-400 text-slate-300 transition-colors border border-slate-700/60 group-hover:border-cyan-800/40">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {cat.productCount} références
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-medium">
                  <span>Parcourir le rayon</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
