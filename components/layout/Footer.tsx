'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import { CATEGORIES } from '@/data/categories';
import {
  Mail,
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function Footer() {
  const {
    setActiveTab,
    setSelectedCategory,
    openLegalPage,
  } = useShop();

  const handleCategoryClick = (catId: any) => {
    setSelectedCategory(catId);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070A0F] border-t border-slate-800/80 text-slate-400 text-sm">
      {/* Reassurance Banner */}
      <div className="border-b border-slate-800/60 bg-[#0B0F17]/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Livraison Instantanée &lt; 60s</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Clé et guide d&apos;activation transmis automatiquement par email et dans votre coffre-fort.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Licences 100% Officielles</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Clés certifiées partenaires, sans activation illégale ni risque de révocation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-950/40 text-blue-400 border border-blue-800/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Paiements Chiffrés SSL 256-bit</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Transactions sécurisées 3D-Secure par Stripe, PayPal, Apple Pay et Crypto.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-800/30 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Support Client 7j/7 en Français</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Assistance immédiate à l&apos;activation par email et messagerie dédiée.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <NovalysLogo variant="store" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plateforme e-commerce spécialisée dans la vente de produits numériques, abonnements d&apos;intelligence artificielle, licences logicielles officielles et codes gaming au meilleur prix garanti.
            </p>

            <div className="pt-2 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:cherchellsgpp@gmail.com" className="hover:text-cyan-300 transition-colors">
                  cherchellsgpp@gmail.com
                </a>
              </div>
              <div className="text-slate-400 pl-6">
                Service client 100% en ligne disponible 7j/7
              </div>
            </div>

            {/* Reassurance Guarantee Box */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs max-w-sm">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantie d&apos;Activation Immédiate</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Toutes nos licences et clés logicielles sont vérifiées et garanties 100% fonctionnelles dès leur réception.
              </p>
            </div>

            {/* Creator Affiliate Callout */}
            <a
              href="/affilies"
              className="block p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 text-xs max-w-sm hover:border-purple-400/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Programme Partenaire Créateur</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  25%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                Monétisez vos vidéos TikTok, Reels ou canal Telegram. Touchez 25% de commission immédiate sur chaque vente.
              </p>
            </a>
          </div>

          {/* Categories column */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Rayons Numériques
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & Support */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Navigation &amp; Aide
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('promotions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Promotions &amp; Bundles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  À Propos de la plateforme
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Contact &amp; Assistance
                </button>
              </li>
              <li>
                <a
                  href="/affilies"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors flex items-center gap-1.5 text-left"
                >
                  <span>Devenir Affilié / Partenaire</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    25%
                  </span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => openLegalPage('faq')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Foire Aux Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalPage('delivery')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Procédure de livraison digitale
                </button>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Informations Légales
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openLegalPage('cgv')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalPage('privacy')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Politique de Confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalPage('refund')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Politique de Remboursement
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} NOVALYS Digital. Tous droits réservés. Plateforme de distribution de licences numériques certifiées.
          </p>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Clés certifiées valides
            </span>
            <span>·</span>
            <span>Stripe &amp; 3D Secure</span>
            <span>·</span>
            <span>Livraison &lt; 60s</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
