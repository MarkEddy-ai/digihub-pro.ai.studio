'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  FunnelLocale,
  LOCALIZED_DIALECT_DATA,
  getFunnelProductBySlug,
  FUNNEL_UPSELL_OFFER,
  FUNNEL_ORDER_BUMP,
} from '@/data/funnelOffers';
import {
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  ExternalLink,
  Tag,
  Clock,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface FunnelDeliveryVaultProps {
  slug: string;
}

export function FunnelDeliveryVault({ slug }: FunnelDeliveryVaultProps) {
  const searchParams = useSearchParams();
  const { orders, formatPrice, showToast } = useShop();

  const orderId = searchParams.get('orderId') || '';
  const locale = (searchParams.get('locale') as FunnelLocale) || 'dz';
  const upsellAccepted = searchParams.get('upsell') === '1';

  const product = getFunnelProductBySlug(slug);
  const dialectData = LOCALIZED_DIALECT_DATA[locale] || LOCALIZED_DIALECT_DATA.dz;

  // Find associated order
  const order = useMemo(() => {
    return orders.find((o) => o.id === orderId) || orders[0];
  }, [orders, orderId]);

  // Keys visibility & copied state
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({
    main: true,
    upsell: true,
  });

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Digital License Keys for presentation
  const mainLicenseKey = useMemo(() => {
    if (order?.delivered_secret_data) return order.delivered_secret_data;
    // Fallback official-looking retail key for the funnel display
    if (product.id === 'prod-windows-11-pro') {
      return 'W11PRO-VK7JG-NPHTM-C97JM-9MPGT';
    } else if (product.id === 'prod-chatgpt-plus') {
      return 'USER: openai.vip.client982@digitalvault.me | PASS: GPT4o#UltraSecure2026';
    } else if (product.id === 'prod-black-myth-wukong') {
      return 'STEAM-BMWK8-99X7A-45QRT-88VIP';
    }
    return 'OFFICIAL-RETAIL-KEY-98412-GENUINE';
  }, [order, product]);

  const upsellLicenseKey = 'OFFICE24-7X9NN-88BHT-CQM92-34VIP';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    showToast('Clé d\'activation copiée dans le presse-papiers !', 'success');
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    showToast('Code promo VIP -20% copié !', 'info');
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const isPendingVerification = order?.status === 'pending_verification';

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Top Header & Order Confirmation */}
        <div className="text-center space-y-3 pt-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
            {isPendingVerification ? 'COMMANDE ENREGISTRÉE' : 'PAIEMENT CONFIRMÉ • CLÉ DÉLIVRÉE'}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isPendingVerification
              ? 'Virement BaridiMob Transmis avec Succès !'
              : 'Félicitations ! Vos Clés Officielles sont Prêtes'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Commande <span className="font-mono text-cyan-300 font-bold">{order?.orderNumber || 'NVX-98412'}</span> • Un récapitulatif détaillé a été transmis à <strong className="text-slate-200">{order?.customer_email || order?.customer.email || 'votre adresse e-mail'}</strong>.
          </p>
        </div>

        {/* ALGERIA BARIDIMOB PENDING VERIFICATION NOTICE */}
        {isPendingVerification && (
          <div className="bg-amber-950/30 border border-amber-500/50 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xl">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-300 text-sm">
                Vérification du reçu BaridiMob en cours par notre équipe
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Votre capture de virement est actuellement examinée par notre administrateur. Votre clé sera déverrouillée ci-dessous et transmise par e-mail / WhatsApp dans les prochaines minutes.
              </p>
              <div className="pt-1.5 flex items-center gap-2 text-slate-400 text-[11px]">
                <span>Besoin d&apos;accélérer la validation ? Contactez notre support WhatsApp au :</span>
                <strong className="text-white font-mono">+213 555 99 88 77</strong>
              </div>
            </div>
          </div>
        )}

        {/* 1. DIGITAL KEY DELIVERY VAULT (MAIN ITEM) */}
        <div className="bg-[#0c1424] rounded-3xl border-2 border-cyan-500/40 p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">{product.title}</h2>
                <p className="text-xs text-slate-400">Licence Retail Authentique • Activation 100% Permanente</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                STATUT : ACTIVE
              </span>
            </div>
          </div>

          {/* Secret Key Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Votre Clé d&apos;Activation :</span>
              <button
                onClick={() => setRevealedKeys((prev) => ({ ...prev, main: !prev.main }))}
                className="hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                {revealedKeys.main ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealedKeys.main ? 'Masquer' : 'Afficher'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-cyan-500/50 shadow-inner">
              <span className="font-mono text-sm sm:text-base font-black text-cyan-300 tracking-wider break-all select-all flex-1 text-center sm:text-left">
                {revealedKeys.main ? mainLicenseKey : '•••••-•••••-•••••-•••••-•••••'}
              </span>

              <button
                onClick={() => handleCopy(mainLicenseKey, 'main')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
              >
                {copiedKeyId === 'main' ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKeyId === 'main' ? 'Copié dans le presse-papiers !' : 'Copier la clé'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantie d&apos;activation officielle Microsoft / OpenAI
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ID Licence: #{order?.id || 'LIC-89104'}
            </span>
          </div>
        </div>

        {/* 2. UPSELL ITEM VAULT (IF ACCEPTED IN ONE-CLICK UPSELL) */}
        {upsellAccepted && (
          <div className="bg-[#0c1424] rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-7 shadow-2xl space-y-5 animate-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {FUNNEL_UPSELL_OFFER.title[locale] || FUNNEL_UPSELL_OFFER.title.intl}
                  </h2>
                  <p className="text-xs text-slate-400">Offre One-Click Upsell Ajoutée (-70%)</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                INCLUSE &amp; LIVRÉE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Clé Office 2024 Pro Plus :</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-emerald-500/50 shadow-inner">
                <span className="font-mono text-sm sm:text-base font-black text-emerald-300 tracking-wider break-all select-all flex-1 text-center sm:text-left">
                  {upsellLicenseKey}
                </span>

                <button
                  onClick={() => handleCopy(upsellLicenseKey, 'upsell')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
                >
                  {copiedKeyId === 'upsell' ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKeyId === 'upsell' ? 'Copié !' : 'Copier la clé'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. STEP-BY-STEP ACTIVATION GUIDE (3 ÉTAPES) */}
        <div className="bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              Guide d&apos;Activation Rapide en 3 Étapes
            </h3>
            <p className="text-xs text-slate-400">
              Suivez ces instructions pour activer votre licence sans délai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.activationSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-sm flex items-center justify-center border border-cyan-500/40">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-white pt-1">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RETENTION & GLOBAL CATALOG CARD (-20% COUPON + ANCHOR TO STORE) */}
        <div className="bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black uppercase">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Cadeau de Bienvenue Client VIP
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Profitez de -20% sur tout notre catalogue général !
            </h3>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Découvrez plus de 50 licences officielles, abonnements IA (Midjourney, Claude Pro), logiciels d&apos;ingénierie et clés Steam au meilleur prix.
            </p>

            {/* Coupon Code Pill */}
            <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs text-slate-400">Votre code exclusif :</span>
              <button
                onClick={() => handleCopyCoupon('VIP-RETENTION-20')}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-indigo-400 text-indigo-300 font-mono font-black text-xs flex items-center gap-1.5 hover:bg-slate-900 transition-colors"
              >
                <span>VIP-RETENTION-20</span>
                {copiedCoupon ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Anchor Button to Global Store */}
          <div className="shrink-0 w-full md:w-auto">
            <a
              href="/"
              className="w-full md:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-98"
            >
              <span>Explorer la Boutique Globale</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </a>
          </div>
        </div>

        {/* 5. NEED HELP / WHATSAPP SUPPORT */}
        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-slate-500">
            Une question ou besoin d&apos;assistance pour votre installation ?
          </p>
          <a
            href="https://wa.me/213555998877?text=Bonjour%20Novalys%2C%20j%27ai%20besoin%20d%27aide%20pour%20ma%20commande%20digitale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-500/30 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Contacter le Support WhatsApp 7j/7</span>
          </a>
        </div>
      </div>
    </div>
  );
}
