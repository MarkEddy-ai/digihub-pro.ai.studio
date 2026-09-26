'use client';

import React from 'react';
import Link from 'next/link';
import { FUNNEL_PRODUCTS, LOCALIZED_DIALECT_DATA } from '@/data/funnelOffers';
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Globe2,
  ExternalLink,
  Layers,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export default function FunnelsIndexPage() {
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>MOTEUR DE FUNNELS DIGITAL • CONVERSION META &amp; TIKTOK ADS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Landing Pages Mono-Produit Hyper-Ciblées
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Sélectionnez une landing page pour tester le tunnel de conversion complet :
            Landing &rarr; Sélecteur de packs &rarr; Paiement localisé &rarr; Order Bump VIP &rarr; One-Click Upsell &rarr; Digital Delivery Vault.
          </p>
        </div>

        {/* Product Funnels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FUNNEL_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#0e1626] rounded-3xl border border-slate-800 hover:border-cyan-500/50 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                  {prod.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-xs flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {prod.rating}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-white leading-snug">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.subtitle}
                  </p>
                </div>

                {/* Regional Variations Links */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tester par région &amp; dialecte :
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      href={`/f/${prod.slug}?locale=dz`}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1">
                        <span>🇩🇿</span>
                        <span>Algérie (DZD)</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </Link>

                    <Link
                      href={`/f/${prod.slug}?locale=sa`}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1">
                        <span>🇸🇦</span>
                        <span>السعودية (SAR)</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </Link>

                    <Link
                      href={`/f/${prod.slug}?locale=ae`}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1">
                        <span>🇦🇪</span>
                        <span>Émirats (AED)</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </Link>

                    <Link
                      href={`/f/${prod.slug}?locale=intl`}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1">
                        <span>🌐</span>
                        <span>Global (USD)</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </Link>
                  </div>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/f/${prod.slug}`}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Lancer le Funnel Express</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Back to store navigation */}
        <div className="text-center pt-6 border-t border-slate-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>&larr; Retourner à la boutique générale NOVALYS</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
