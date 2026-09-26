'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS, PROMO_BUNDLES } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Timer, Sparkles, ArrowRight, Check } from 'lucide-react';

export function FlashDeals() {
  const { setActiveTab, openProductPage, formatPrice, addToCart, products } = useShop();

  // Simulated countdown timer: 14h 28m 42s
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal).slice(0, 3);
  const featuredBundle = PROMO_BUNDLES[1]; // Pack Productivité Office + Windows

  return (
    <section className="py-14 sm:py-18 bg-[#0B0F17] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Active Countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Ventes Flash &amp; Offres Limitées</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Promotions exceptionnelles jusqu&apos;à -90%
            </h2>
          </div>

          {/* Countdown block */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-rose-500/30 text-slate-200">
            <Timer className="w-4 h-4 text-rose-400 animate-spin-slow" />
            <span className="text-xs text-slate-400 font-medium">Expire dans :</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
              <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-rose-400">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Featured Big Bundle Banner */}
        {featuredBundle && (
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-700/80 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  {featuredBundle.badge}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {featuredBundle.title}
                </h3>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {featuredBundle.description}
                </p>

                {/* Included items */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {featuredBundle.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="lg:col-span-4 lg:border-l lg:border-slate-800 lg:pl-6 flex flex-col justify-center items-start lg:items-center text-left lg:text-center space-y-3">
                <div>
                  <div className="text-xs text-slate-400">Tarif pack groupé :</div>
                  <div className="flex items-baseline gap-2 justify-start lg:justify-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {formatPrice(featuredBundle.bundlePrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {formatPrice(featuredBundle.originalPrice)}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Économisez {(featuredBundle.originalPrice - featuredBundle.bundlePrice).toFixed(2)} € immédiatement
                  </span>
                </div>

                <button
                  onClick={() => {
                    // add the main products of this bundle or open promo page
                    setActiveTab('promotions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Profiter du Pack</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Individual Flash Products */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
