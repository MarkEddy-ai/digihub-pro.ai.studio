'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Mail, MessageSquare, Headphones, ArrowRight, ShieldCheck } from 'lucide-react';

export function ContactCtaBlock() {
  const { setActiveTab } = useShop();

  return (
    <section className="py-14 sm:py-18 bg-gradient-to-b from-[#090D14] to-[#070A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0E1626] to-slate-900 border border-slate-700/80 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Subtle glow aura */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <Headphones className="w-3.5 h-3.5" />
              <span>Assistance Clientèle 7j/7</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Une question avant d&apos;acheter ou besoin d&apos;un devis pour votre équipe ?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Notre équipe d&apos;experts logiciels vous répond sous 15 minutes. Écrivez-nous directement à{' '}
              <a
                href="mailto:cherchellsgpp@gmail.com"
                className="text-cyan-400 font-semibold underline hover:text-cyan-300 transition-colors"
              >
                cherchellsgpp@gmail.com
              </a>{' '}
              ou utilisez notre formulaire de support interactif.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setActiveTab('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ouvrir un ticket de support</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="mailto:cherchellsgpp@gmail.com?subject=Demande%20d%27information%20NOVALYS%20Digital"
                className="px-5 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Écrire un e-mail direct</span>
              </a>
            </div>

            {/* Micro reassurance checklist */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Réponse moyenne &lt; 15 min
              </span>
              <span>·</span>
              <span>Support 100% francophone</span>
              <span>·</span>
              <span>Accompagnement à l&apos;activation à distance offert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
