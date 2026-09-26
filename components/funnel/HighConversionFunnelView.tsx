'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomFunnelConfig } from '@/types';
import { useShop } from '@/context/ShopContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Star,
  Lock,
  ArrowRight,
  ChevronDown,
  Gift,
  HelpCircle,
  Smartphone,
  ExternalLink,
  Flame,
  Check,
  ShoppingCart,
  Layers,
  Award,
} from 'lucide-react';

interface HighConversionFunnelViewProps {
  funnel: CustomFunnelConfig;
  previewMode?: boolean;
}

export function HighConversionFunnelView({
  funnel,
  previewMode = false,
}: HighConversionFunnelViewProps) {
  const { placeOrder, showToast } = useShop();

  // Urgency Timer for Flash and Direct funnels
  const [timeLeft, setTimeLeft] = useState({
    minutes: funnel.urgencyMinutes || 12,
    seconds: 45,
  });

  // Order Bump state
  const [bumpSelected, setBumpSelected] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Countdown timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 14, seconds: 59 }; // loop for demo
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Regional settings and copy
  const isRtl = funnel.targetRegion === 'gulf';
  const regionCurrency =
    funnel.targetRegion === 'gulf' ? 'SAR' : funnel.targetRegion === 'dz' ? 'DZD' : 'USD';
  const displayedPrice =
    funnel.targetRegion === 'gulf'
      ? `${funnel.priceSar} SAR`
      : funnel.targetRegion === 'dz'
      ? `${funnel.priceDzd.toLocaleString()} DA`
      : `$${funnel.priceUsd.toFixed(2)}`;

  const displayedCompareAt =
    funnel.targetRegion === 'gulf'
      ? `${Math.round(funnel.compareAtPriceUsd * 3.75)} SAR`
      : funnel.targetRegion === 'dz'
      ? `${Math.round(funnel.compareAtPriceUsd * 150).toLocaleString()} DA`
      : `$${funnel.compareAtPriceUsd.toFixed(2)}`;

  const discountPercent = Math.max(
    Math.round(((funnel.compareAtPriceUsd - funnel.priceUsd) / funnel.compareAtPriceUsd) * 100),
    45
  );

  // Theme Styling Palettes
  const themeStyles = {
    cyber_dark: {
      bg: 'bg-[#080d1a]',
      panel: 'bg-[#0e1626]/90 border-slate-800',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500',
      accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
      gradientBtn: 'from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    },
    gold_luxury: {
      bg: 'bg-[#06080e]',
      panel: 'bg-[#0f121d]/90 border-amber-900/40',
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500',
      accentGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
      gradientBtn: 'from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-slate-950',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    },
    emerald_clean: {
      bg: 'bg-[#060f0b]',
      panel: 'bg-[#0d1c15]/90 border-emerald-900/40',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500',
      accentGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      gradientBtn: 'from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-slate-950',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    },
    custom: {
      bg: 'bg-[#080d1a]',
      panel: 'bg-[#0e1626]/90 border-slate-800',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500',
      accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
      gradientBtn: 'from-cyan-500 to-blue-600 text-slate-950',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    },
  }[funnel.themePalette || 'cyber_dark'];

  // Background Pattern CSS
  const bgPatternStyle =
    funnel.bgPattern === 'tech_grid'
      ? {
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px',
        }
      : funnel.bgPattern === 'radial_glow'
      ? {
          background: 'radial-gradient(ellipse at top center, rgba(6, 182, 212, 0.15), transparent 70%), #080d1a',
        }
      : {};

  // Direct checkout action handler
  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      showToast(
        isRtl
          ? 'تم تسجيل طلبك بنجاح! سيتم تحويلك للدفع الآمن عبر Whop.'
          : 'Redirection vers le paiement sécurisé Whop / BaridiMob...',
        'success'
      );
      if (typeof window !== 'undefined' && !previewMode) {
        window.location.href = `/merci?name=${encodeURIComponent('Client')}&amount=${funnel.priceUsd}`;
      }
    }, 900);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={bgPatternStyle}
      className={`min-h-screen ${themeStyles.bg} text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950`}
    >
      {/* 1. TOP FLASH ANNOUNCEMENT BAR (If Flash Sale model or Urgency enabled) */}
      {(funnel.architecture === 'flash' || funnel.urgencyMinutes) && (
        <div className="bg-gradient-to-r from-rose-900/90 via-amber-900/90 to-rose-900/90 border-b border-rose-500/40 py-2 px-4 text-center text-xs font-bold text-white shadow-md relative z-20">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 animate-pulse text-amber-300">
              <Flame className="w-4 h-4 fill-current" />
              <span>
                {isRtl
                  ? 'عرض حصري محدود • ينتهي الخصم قريباً :'
                  : 'VENTE FLASH OFFICIELLE • FIN DE L\'OFFRE DANS :'}
              </span>
            </span>

            <div className="inline-flex items-center gap-1 font-mono font-black bg-black/60 px-3 py-0.5 rounded-lg border border-amber-500/50 text-amber-300 text-sm tabular-nums">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>

            <span className="hidden md:inline text-rose-200">
              {isRtl
                ? `(بقي ${funnel.stockCount} مفتاح فقط متاح في المخزون)`
                : `(Plus que ${funnel.stockCount} licences disponibles en stock)`}
            </span>
          </div>
        </div>
      )}

      {/* 2. HEADER BRANDING & TRUST BADGE */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              N
            </div>
            <div>
              <span className="font-black text-base text-white tracking-wider">NOVALYS</span>
              <span className="text-[10px] text-cyan-400 font-mono ml-1 uppercase">Digital</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isRtl ? 'دفع آمن ومعتمد 100%' : 'Paiement 100% Chiffré & Certifié'}
              </span>
            </div>

            {previewMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                MODE APERÇU
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 3. MAIN HERO CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hook, Value Prop & Bullets */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Hook Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <span className={themeStyles.badge}>
                {isRtl ? 'ترخيص رسمي معتمد' : '⚡ LIVRAISON IMMÉDIATE EN MOINS DE 60s'}
              </span>
            </div>

            {/* Main Headline H1 */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {funnel.hookHeadline}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {funnel.subheadline}
            </p>

            {/* Rating Stars & Social Proof */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-200">
                4.98/5 • {isRtl ? 'أكثر من 3,840 تقييم معتمد' : '+3,840 avis clients vérifiés'}
              </span>
            </div>

            {/* Key Benefits Bullets */}
            <div className="space-y-2.5 pt-2">
              {funnel.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{bullet}</span>
                </div>
              ))}
            </div>

            {/* MODEL SPECIFIC: Direct-to-Checkout Offer Box */}
            <div className={`p-5 rounded-2xl ${themeStyles.panel} border shadow-xl space-y-4`}>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    {isRtl ? 'السعر النهائي بعد التخفيض :' : 'Prix promotionnel aujourd\'hui :'}
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
                      {displayedPrice}
                    </span>
                    <span className="text-sm text-slate-500 line-through font-mono">
                      {displayedCompareAt}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs border border-emerald-500/40">
                    -{discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Order Bump Option */}
              {funnel.orderBumpEnabled && (
                <div
                  onClick={() => setBumpSelected(!bumpSelected)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                    bumpSelected
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={bumpSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500/30 mt-0.5 cursor-pointer"
                  />
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-amber-300 block">
                      ⚡ {isRtl ? 'إضافة ضمان الاستبدال الفوري VIP (+10 ر.س)' : 'OUI ! Ajouter la Garantie Remplacement VIP (+2.99 $)'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isRtl
                        ? 'احصل على مفتاح بديل فوري ودعم فني خاص على مدار الساعة.'
                        : 'Support prioritaire immédiat et clé de remplacement sans délai en cas de besoin.'}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Primary Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${themeStyles.gradientBtn} font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl ${themeStyles.accentGlow} cursor-pointer disabled:opacity-50`}
              >
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {isCheckingOut
                    ? isRtl
                      ? 'جاري المعالجة...'
                      : 'Traitement en cours...'
                    : isRtl
                    ? 'اشتري الآن واحصل على التفعيل الفوري'
                    : 'COMMANDER MAINTENANT • ACCÈS IMMÉDIAT'}
                </span>
                <ArrowRight className={`w-5 h-5 stroke-[2.5] ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  {isRtl ? 'دفع آمن ومشفر' : 'Paiement sécurisé SSL'}
                </span>
                <span>•</span>
                <span>{isRtl ? 'تسليم فوري عبر الإيميل' : 'Envoi automatique par email'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-70" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={funnel.heroImage}
                alt={funnel.title}
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating verified badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">
                      {isRtl ? 'ترخيص رقمي أصلي' : 'Licence Numérique Vérifiée'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">100% Genuine Partner</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {isRtl ? 'مضمون' : 'Actif'}
                </span>
              </div>
            </div>

            {/* Target Platform Optimization Banner */}
            {funnel.adPlatform === 'tiktok' && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  {isRtl
                    ? 'متوافق تماماً مع مستخدمي تيك توك وسريع التفعيل على الهاتف'
                    : 'Format ultra-rapide optimisé pour votre mobile • Activation en 1 clic'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. MODEL SPECIFIC: LONG-FORM SALES LETTER SECTION */}
        {funnel.architecture === 'longform' && (
          <div className="space-y-8 pt-8 border-t border-slate-800">
            {/* Storytelling Problem / Solution Block */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl
                  ? 'لماذا يدفع الآلاف مبالغ شهرية بينما يمكنك الحصول على النسخة الدائمة؟'
                  : 'Pourquoi continuer à payer des abonnements exorbitants chaque mois ?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                La plupart des utilisateurs perdent des centaines d&apos;euros par an dans des renouvellements automatiques ou risquent la sécurité de leurs données avec des versions crackées instables. <strong>NOVALYS</strong> vous propose l&apos;alternative officielle, légale et garantie : une clé permanente liée à votre compte, bénéficiant de toutes les mises à jour de sécurité constructeur.
              </p>
            </div>

            {/* Features Decomposition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-2">
                <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 inline-block">
                  <Zap className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-white text-sm">Activation Téléphonique &amp; Web</h3>
                <p className="text-xs text-slate-400">
                  Guide pas-à-pas illustré en français et arabe pour activer votre logiciel en toute simplicité.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-2">
                <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 inline-block">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-white text-sm">Garantie Totale 30 Jours</h3>
                <p className="text-xs text-slate-400">
                  Remplacement sans condition ou remboursement en cas de difficulté technique d&apos;activation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-2">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 inline-block">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-white text-sm">Mises à Jour Officielles</h3>
                <p className="text-xs text-slate-400">
                  Recevez directement les patchs de sécurité et les nouvelles fonctionnalités sans interruption.
                </p>
              </div>
            </div>

            {/* Accordion FAQ */}
            <div className="space-y-3 pt-4">
              <h3 className="text-lg font-black text-white">
                {isRtl ? 'الأسئلة الشائعة (FAQ)' : 'Questions Fréquemment Posées (FAQ)'}
              </h3>
              <div className="space-y-2">
                {[
                  {
                    q: isRtl ? 'كيف أستلم المفتاح بعد الدفع؟' : 'Comment vais-je recevoir ma clé après paiement ?',
                    a: isRtl
                      ? 'يتم إرسال المفتاح فوراً إلى بريدك الإلكتروني مع إمكانية الوصول إليه من صفحة الشكر في غضون 30 ثانية.'
                      : 'Votre clé de licence est générée instantanément sur la page de confirmation et expédiée à votre adresse email en moins de 60 secondes.',
                  },
                  {
                    q: isRtl ? 'هل المفتاح أصلي ويعمل مدى الحياة؟' : 'La licence est-elle authentique et sans expiration ?',
                    a: isRtl
                      ? 'نعم، جميع تراخيصنا رسمية ومطابقة لمعايير المطور الأصلي مع ضمان دائم.'
                      : 'Oui, il s\'agit de licences officielles perpétuelles sans abonnement récurrent ni frais cachés.',
                  },
                  {
                    q: isRtl ? 'ماذا لو واجهت مشكلة في التفعيل؟' : 'Que faire si je rencontre un problème lors de l\'activation ?',
                    a: isRtl
                      ? 'فريق الدعم الفني متاح 24/7 لمساعدتك واستبدال المفتاح فوراً إن لزم الأمر.'
                      : 'Notre support client francophone et arabophone est joignable 7j/7 pour vous assister et remplacer la clé si nécessaire.',
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer select-none transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white">
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          openFaqIndex === i ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      />
                    </div>
                    {openFaqIndex === i && (
                      <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. STICKY BOTTOM BAR FOR TIKTOK & MOBILE CONVERSION */}
        {funnel.adPlatform === 'tiktok' && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl sm:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Offre Flash :</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{displayedPrice}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <span>{isRtl ? 'طلب الآن' : 'Commander'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} NOVALYS Digital • {funnel.guaranteeText}</p>
        <p className="mt-1">Paiements sécurisés via Whop Merchant of Record &amp; Stripe Connect.</p>
      </footer>
    </div>
  );
}
