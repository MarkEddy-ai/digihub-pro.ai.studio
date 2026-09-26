'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';

export function PopularProducts() {
  const { setActiveTab, products } = useShop();

  // Pick popular bestsellers from reactive store
  const popular = products.filter((p) => p.isPopular).slice(0, 4);

  return (
    <section className="py-14 sm:py-18 bg-[#090D14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Best-sellers du moment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Produits les plus demandés
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Des milliers de clés activées cette semaine avec 99.8% de satisfaction client.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Voir toute la boutique</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
