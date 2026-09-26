'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import {
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  ExternalLink,
  LifeBuoy,
  Lock,
  Zap,
} from 'lucide-react';

function MerciContent() {
  const searchParams = useSearchParams();

  // Extract name from query parameters (?name=... or ?customer_name=...)
  const queryName =
    searchParams.get('name') ||
    searchParams.get('customer_name') ||
    searchParams.get('client') ||
    searchParams.get('user');

  const displayName = queryName ? decodeURIComponent(queryName).trim() : 'Cher Membre Privilégié';

  // State for copying the generated license key
  const [copiedKey, setCopiedKey] = useState(false);
  const [isKeyRevealed, setIsKeyRevealed] = useState(true);

  // VIP Enterprise License key format for Whop buyers
  const licenseKey = 'NOVALYS-PRO-500-WHOP-9872-4XKL-8991';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Reassurance Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <NovalysLogo variant="store" size="md" />

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Commande Whop Confirmée</span>
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              Boutique
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* Success Icon & Top Headline */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            {/* Pulsing ambient glow */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.35)] flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paiement Validé avec Succès • Whop Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Félicitations, {displayName} !
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Votre commande pour la plateforme complète <strong className="text-white">NOVALYS Digital</strong> d&apos;une valeur de <strong className="text-emerald-400 font-mono">500 $US</strong> a été enregistrée avec succès.
            </p>
          </div>
        </div>

        {/* Official Letter & Reassurance Card */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          {/* Subtle decorative glow at top-right */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-b border-slate-800/80 pb-6">
            <p>
              Nous vous remercions sincèrement pour votre confiance et pour votre investissement dans l&apos;écosystème <strong className="text-white font-semibold">NOVALYS</strong>. Vous disposez désormais d&apos;une licence perpétuelle complète avec accès immédiat à notre infrastructure d&apos;e-commerce numérique, à nos tunnels de vente haute conversion pour Meta &amp; TikTok Ads, ainsi qu&apos;à l&apos;ensemble de nos outils back-office et de gestion automatisée de licences.
            </p>
            <p>
              Un récapitulatif complet de votre transaction ainsi que votre facture officielle certifiée ont été automatiquement transmis à votre adresse email associée à votre compte Whop.
            </p>
          </div>

          {/* Transaction Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Produit Acquis
              </span>
              <p className="font-bold text-white text-sm">NOVALYS Plateforme Pro</p>
              <span className="text-[10px] text-cyan-400 font-mono">Licence Éditeur Entreprise</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Montant Réglé
              </span>
              <p className="font-black text-emerald-400 font-mono text-base tabular-nums">
                500,00 $US
              </p>
              <span className="text-[10px] text-slate-500">Paiement unique sécurisé</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Mode de Livraison
              </span>
              <p className="font-bold text-white text-sm">Instantanée &amp; Email</p>
              <span className="text-[10px] text-slate-400">Via Whop Notifications</span>
            </div>
          </div>

          {/* Digital License Key Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0b1329] to-slate-950 border border-cyan-500/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Votre Clé de Déploiement Unique
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE &amp; DÉVERROUILLÉE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 font-mono text-sm sm:text-base font-black tracking-wider text-cyan-300 flex items-center justify-between select-all">
                <span>{isKeyRevealed ? licenseKey : '••••••••••••••••••••••••••••••••'}</span>
                <button
                  type="button"
                  onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                  className="text-xs text-slate-500 hover:text-slate-300 ml-2 cursor-pointer font-sans"
                  title="Afficher/Masquer"
                >
                  {isKeyRevealed ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyKey}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {copiedKey ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? 'Clé Copiée !' : 'Copier la Clé'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Conservez cette clé en lieu sûr. Elle vous permettra d&apos;activer vos instances et passerelles de paiement.
            </p>
          </div>

          {/* Next Steps Checklist */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Prochaines Étapes pour Démarrer Immédiatement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-black font-mono">
                  1
                </div>
                <h3 className="font-bold text-white text-xs">Accéder au Back-Office</h3>
                <p className="text-[11px] text-slate-400">
                  Connectez-vous à votre panneau d&apos;administration pour configurer votre catalogue, vos prix multi-devises et vos passerelles.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black font-mono">
                  2
                </div>
                <h3 className="font-bold text-white text-xs">Consulter les Ressources</h3>
                <p className="text-[11px] text-slate-400">
                  Découvrez les guides de conversion CRO, les scripts d&apos;acquisition Meta Ads/TikTok et l&apos;export Google Sheets.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black font-mono">
                  3
                </div>
                <h3 className="font-bold text-white text-xs">Support Prioritaire VIP</h3>
                <p className="text-[11px] text-slate-400">
                  Notre équipe technique dédiée reste joignable à <strong className="text-slate-300">cherchellsgpp@gmail.com</strong> pour tout accompagnement.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Accéder à mon espace</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <a
                href="mailto:cherchellsgpp@gmail.com?subject=Assistance%20Client%20Whop%20Novalys"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <LifeBuoy className="w-4 h-4 text-emerald-400" />
                <span>Contacter le Support</span>
              </a>

              <a
                href="https://whop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                title="Consulter votre compte et reçu Whop"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Espace Whop</span>
              </a>
            </div>
          </div>
        </div>
        {/* Bloc de téléchargement du code source .ZIP */}
          <div className="my-8 p-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-center shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">
              📦 Fichiers sources & Livrables du projet
            </h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Téléchargez l'archive complète de l'application prête à l'emploi directement sur votre ordinateur.
            </p>
            <a
              href="/code-source.zip"
              download="code-source.zip"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le code source (.ZIP)
            </a>
          </div>

        {/* Bottom Reassurance Footer */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} NOVALYS Digital • Tous droits réservés.</p>
          <p>Transaction sécurisée via le protocole chiffré Whop Payments &amp; Stripe Connect.</p>
        </div>
      </main>
    </div>
  );
}

export default function MerciPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080d1a] text-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-400">Chargement de votre confirmation de commande...</p>
          </div>
        </div>
      }
    >
      <MerciContent />
    </Suspense>
  );
}
