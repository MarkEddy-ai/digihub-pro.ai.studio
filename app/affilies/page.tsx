'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import {
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Video,
  ExternalLink,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

function AffiliatesPublicContent() {
  const { registerAffiliate, products, showToast } = useShop();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    platform: 'tiktok' | 'instagram' | 'telegram' | 'youtube' | 'website';
    socialHandle: string;
    payoutMethod: 'baridimob' | 'ccp' | 'stc_pay' | 'bank_transfer' | 'paypal' | 'crypto';
    payoutDetails: string;
  }>({
    name: '',
    email: '',
    platform: 'tiktok',
    socialHandle: '',
    payoutMethod: 'baridimob',
    payoutDetails: '',
  });

  const [registeredAffiliate, setRegisteredAffiliate] = useState<{
    code: string;
    name: string;
    email: string;
  } | null>(null);

  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('store_global');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Veuillez renseigner au moins votre nom et votre adresse email.', 'warning');
      return;
    }

    const created = registerAffiliate({
      name: formData.name,
      email: formData.email,
      platform: formData.platform,
      socialHandle: formData.socialHandle || `@${formData.name.toLowerCase().replace(/\s+/g, '')}`,
      payoutMethod: formData.payoutMethod,
      payoutDetails: formData.payoutDetails || 'À confirmer avant premier versement',
    });

    setRegisteredAffiliate({
      code: created.code,
      name: created.name,
      email: created.email,
    });

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const getAffiliateLink = () => {
    if (!registeredAffiliate) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://novalys.shop';
    if (selectedProductSlug === 'store_global') {
      return `${origin}/?ref=${registeredAffiliate.code}`;
    }
    return `${origin}/p/${selectedProductSlug}?ref=${registeredAffiliate.code}`;
  };

  const handleCopyLink = () => {
    const link = getAffiliateLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('Lien affilié copié avec succès ! Collez-le dans votre bio TikTok ou Story.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <NovalysLogo variant="store" size="md" />

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Retour à la boutique
            </Link>
            <a
              href="#join-form"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all"
            >
              Rejoindre (25% Commission)
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>PROGRAMME PARTENAIRES &amp; CRÉATEURS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Monétisez votre audience avec{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              25% de Commission Immédiate
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Recommandez des licences officielles Windows, Office, comptes ChatGPT Plus, Canva Pro et abonnements IA. Vos abonnés bénéficient de prix imbattables et vous touchez 25% de chaque euro/dinar généré.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Paiement BaridiMob (🇩🇿), STC Pay (🇸🇦) ou PayPal/Crypto</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cookie de tracking valide 30 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tableau de bord créateur en direct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 space-y-12">
        {/* Dynamic Affiliate Dashboard if already generated */}
        {registeredAffiliate ? (
          <div className="bg-[#0e1626] border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-purple-600/30">
                  🎉
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Bienvenue dans le Club Partenaires, {registeredAffiliate.name} !
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Votre compte est validé avec 25% de commission sur toutes les ventes trackées.
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono font-bold text-xs self-start sm:self-center">
                Code Actif : {registeredAffiliate.code}
              </div>
            </div>

            {/* Link Generator Tool */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Générateur de Lien Partenaire</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cible du lien
                  </label>
                  <select
                    value={selectedProductSlug}
                    onChange={(e) => setSelectedProductSlug(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="store_global">Boutique Globale (Tous les produits)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title || p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre URL Trackée avec Cookie 30 Jours
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getAffiliateLink()}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center sm:text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Commission par Vente Windows</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1">462.50 DZD (25%)</div>
                <div className="text-[11px] text-slate-500">Pour 10 ventes/jour = ~140 000 DZD/mois</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Commission par Vente ChatGPT Plus</div>
                <div className="text-lg font-black text-cyan-400 font-mono mt-1">11.25 SAR / 3.00 $US</div>
                <div className="text-[11px] text-slate-500">Idéal pour vos lives TikTok &amp; Reels</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Délai de Virement</div>
                <div className="text-lg font-black text-purple-400 font-mono mt-1">Sous 24 Heures</div>
                <div className="text-[11px] text-slate-500">Directement sur votre compte BaridiMob / STC</div>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form Box */
          <div id="join-form" className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h2 className="text-2xl font-black text-white">
                Inscription Immédiate au Programme Partenaire
              </h2>
              <p className="text-xs text-slate-400">
                Remplissez ce formulaire en 30 secondes pour obtenir instantanément votre identifiant affilié et votre lien de parrainage.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre Nom ou Pseudo Réseau
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Karim Tech DZ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Adresse Email (Pour les notifications de ventes)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@votre-chaine.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre Réseau Principal
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="tiktok">🎵 TikTok</option>
                    <option value="instagram">📸 Instagram Reels</option>
                    <option value="telegram">✈️ Canal Telegram</option>
                    <option value="youtube">▶️ YouTube</option>
                    <option value="website">🌐 Site Web / Blog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom du compte ou Lien du profil
                  </label>
                  <input
                    type="text"
                    placeholder="@moncompte (ex: 50K followers)"
                    value={formData.socialHandle}
                    onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Méthode Préférée pour Recevoir vos Commissions
                  </label>
                  <select
                    value={formData.payoutMethod}
                    onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="baridimob">BaridiMob (Algérie 🇩🇿)</option>
                    <option value="ccp">Compte CCP (Algérie 🇩🇿)</option>
                    <option value="stc_pay">STC Pay (Arabie Saoudite 🇸🇦)</option>
                    <option value="bank_transfer">Virement Bancaire (IBAN)</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">USDT / Crypto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coordonnées de virement (RIP / Téléphone / Email)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: RIP BaridiMob 007999... ou N° STC Pay"
                    value={formData.payoutDetails}
                    onChange={(e) => setFormData({ ...formData, payoutDetails: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  🚀 Activer Mon Compte Partenaire &amp; Obtenir Mon Lien
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Creator Kit & Marketing Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Idée Vidéo TikTok #1</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              &laquo; Arrêtez d&apos;utiliser des activateurs KMS douteux avec virus. Voici comment activer Windows 11 Pro légalement pour moins de 1800 DA avec clé officielle Retail permanente. &raquo;
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Idée Vidéo TikTok #2</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              &laquo; 3 outils indispensables pour étudiants et créateurs : Office 2024 à vie, ChatGPT Plus sans carte bancaire internationale via paiement BaridiMob. Lien en bio ! &raquo;
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Argument Confiance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rappelez à votre communauté que les clés sont livrées immédiatement en moins de 60 secondes et qu&apos;une garantie de remplacement 100% est incluse avec support 7j/7.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} NOVALYS Digital Partners. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <ShopProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400">Chargement...</div>}>
        <AffiliatesPublicContent />
      </Suspense>
    </ShopProvider>
  );
}
