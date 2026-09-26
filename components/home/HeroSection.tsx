'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Search,
  Star,
  Lock,
  Clock,
} from 'lucide-react';

export function HeroSection() {
  const { setActiveTab, setSelectedCategory, openProductPage, setSearchQuery, searchQuery } = useShop();

  const handleQuickTag = (tag: string) => {
    setSearchQuery(tag);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#090D14] via-[#0B0F17] to-[#0D121F] border-b border-slate-800/80 pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background ambient lighting effects matching circular logo motif */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, subhead, search, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top editorial kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Plateforme de distribution numérique certifiée</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Livraison &lt; 60 secondes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Vos licences logicielles &amp; abonnements IA au{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                meilleur prix garanti
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Achetez rapidement vos outils indispensables : <strong>ChatGPT Plus</strong>,{' '}
              <strong>Canva Pro</strong>, <strong>Windows 11</strong>, <strong>Office 2024</strong>,{' '}
              <strong>CapCut Pro</strong> et <strong>Xbox Game Pass</strong>. Clés officielles garanties 100% avec délivrance immédiate.
            </p>

            {/* Interactive Search Bar in Hero */}
            <div className="pt-1 max-w-xl mx-auto lg:mx-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setActiveTab('catalog');
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Que recherchez-vous ? (ex: ChatGPT, Windows 11, Canva...)"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-1"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shrink-0"
                >
                  Trouver
                </button>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-2.5 text-xs text-slate-400">
                <span className="text-slate-400 text-[11px]">Tendances :</span>
                {['ChatGPT Plus', 'Windows 11 Pro', 'Canva Pro', 'Office 2024', 'Xbox Ultimate', 'CapCut Pro'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickTag(tag)}
                      className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => {
                  setActiveTab('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <span>Découvrir les produits</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('promotions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Voir les Offres Flash</span>
              </button>
            </div>

            {/* 3 Metric Trust Points */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-mono">45 000+</div>
                <div className="text-[11px] text-slate-400">Licences délivrées</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono">&lt; 60s</div>
                <div className="text-[11px] text-slate-400">Livraison moyenne</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white font-mono">4.9 / 5</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Note clients certifiée</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Product Hero Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0F172A] border border-slate-700/80 p-5 shadow-2xl overflow-hidden">
              {/* Top card header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                    En stock immédiat
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Livraison instantanée
                </div>
              </div>

              {/* Product preview */}
              <div className="mt-4 space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group cursor-pointer"
                  onClick={() => openProductPage('chatgpt-plus-abonnement')}
                >
                  <img
                    src="https://picsum.photos/seed/chatgpt-ai-plus/800/600"
                    alt="ChatGPT Plus OpenAI"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold px-2 py-0.5 rounded">
                    Bestseller IA
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white text-xs font-mono font-bold px-2 py-1 rounded border border-slate-700">
                    14,99 € <span className="line-through text-slate-500 text-[10px]">23,00 €</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
                    <span>IA &amp; Productivité</span>
                    <span>·</span>
                    <span className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 text-slate-200 font-mono text-xs">4.9</span>
                      <span className="ml-1 text-slate-400 text-[11px]">(412 avis)</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => openProductPage('chatgpt-plus-abonnement')}
                    className="text-base font-bold text-white mt-1 hover:text-cyan-400 cursor-pointer transition-colors"
                  >
                    ChatGPT Plus &amp; Team (OpenAI) - Accès Officiel
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    Modèle GPT-4o, raisonnement o1, analyse de données et mode vocal avancé activé immédiatement.
                  </p>
                </div>

                {/* Simulated License Key generation preview */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Format de délivrance numérique :</span>
                    <span className="text-emerald-400 font-mono">Automatisé</span>
                  </div>
                  <div className="font-mono text-cyan-300 bg-slate-900 px-2.5 py-1.5 rounded border border-cyan-900/50 flex items-center justify-between text-xs">
                    <span>GPT4O-XXXXX-XXXXX-94821</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Officiel</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Lien d&apos;invitation ou clé activable directement sur chat.openai.com</span>
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => openProductPage('chatgpt-plus-abonnement')}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Consulter la fiche détaillée</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
