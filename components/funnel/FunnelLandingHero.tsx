'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Currency, OrderPaymentMethod, PaymentGatewayId } from '@/types';
import {
  FunnelProductOffer,
  FunnelLocale,
  LOCALIZED_DIALECT_DATA,
  FUNNEL_ORDER_BUMP,
} from '@/data/funnelOffers';
import { FunnelOrderBump } from './FunnelOrderBump';
import {
  ShieldCheck,
  Star,
  Clock,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Upload,
  Globe2,
  Sparkles,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  CreditCard,
  Layers,
  KeyRound,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface FunnelLandingHeroProps {
  product: FunnelProductOffer;
  initialLocale?: FunnelLocale;
}

export function FunnelLandingHero({ product, initialLocale = 'dz' }: FunnelLandingHeroProps) {
  const router = useRouter();
  const { placeOrder, formatPrice, selectedCurrency, setSelectedCurrency, paymentGateways, showToast } = useShop();

  // Selected locale
  const [locale, setLocale] = useState<FunnelLocale>(initialLocale);
  const dialectData = LOCALIZED_DIALECT_DATA[locale] || LOCALIZED_DIALECT_DATA.dz;
  const [copiedRip, setCopiedRip] = useState(false);

  // Sync shop currency to locale initially
  useEffect(() => {
    setSelectedCurrency(dialectData.currency);
  }, [dialectData.currency, setSelectedCurrency]);

  // Selected pack tier
  const [selectedPackId, setSelectedPackId] = useState<string>(() => {
    const popular = product.packs.find((p) => p.isPopular);
    return popular ? popular.id : product.packs[0]?.id || 'pack-1pc';
  });

  const selectedPack = useMemo(() => {
    return product.packs.find((p) => p.id === selectedPackId) || product.packs[0];
  }, [product, selectedPackId]);

  // Order Bump state
  const [hasOrderBump, setHasOrderBump] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>(() => {
    return dialectData.currency === 'DZD' ? 'baridimob' : dialectData.currency === 'SAR' ? 'mada' : 'stripe';
  });

  // BaridiMob details
  const [transactionRef, setTransactionRef] = useState('');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer state (14:45 ticking down)
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 15, seconds: 0 }; // loop scarcity
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate pricing based on currency and pack multiplier
  const basePriceInCurrency = useMemo(() => {
    switch (dialectData.currency) {
      case 'DZD':
        return product.priceDzd;
      case 'SAR':
        return product.priceSar;
      case 'AED':
        return product.priceAed;
      case 'KWD':
        return product.priceKwd;
      default:
        return product.priceUsd;
    }
  }, [product, dialectData.currency]);

  const packPrice = Math.round(basePriceInCurrency * (selectedPack?.multiplier || 1));

  const bumpPrice = useMemo(() => {
    switch (dialectData.currency) {
      case 'DZD':
        return FUNNEL_ORDER_BUMP.priceDzd;
      case 'SAR':
        return FUNNEL_ORDER_BUMP.priceSar;
      case 'AED':
        return FUNNEL_ORDER_BUMP.priceAed;
      case 'KWD':
        return FUNNEL_ORDER_BUMP.priceKwd;
      default:
        return FUNNEL_ORDER_BUMP.priceUsd;
    }
  }, [dialectData.currency]);

  const finalTotalAmount = packPrice + (hasOrderBump ? bumpPrice : 0);

  // Handle Locale Switcher
  const handleLocaleSwitch = (newLocale: FunnelLocale) => {
    setLocale(newLocale);
    const newContent = LOCALIZED_DIALECT_DATA[newLocale];
    setSelectedCurrency(newContent.currency);
    if (newContent.currency === 'DZD') {
      setPaymentMethod('baridimob');
    } else if (newContent.currency === 'SAR') {
      setPaymentMethod('mada');
    } else if (newContent.currency === 'AED') {
      setPaymentMethod('card');
    } else {
      setPaymentMethod('stripe');
    }
  };

  // Submit Order and proceed to One-Click Upsell
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Veuillez renseigner votre adresse e-mail pour la livraison de la clé.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let gtw: PaymentGatewayId = 'stripe';
      if (paymentMethod === 'baridimob' || paymentMethod === 'ccp') {
        gtw = 'baridimob';
      } else if (paymentMethod === 'paypal') {
        gtw = 'paypal';
      } else if (['mada', 'knet', 'apple_pay', 'stc_pay', 'card'].includes(paymentMethod) || locale === 'sa' || locale === 'ae') {
        gtw = 'tap_payments';
      }

      const names = fullName.trim().split(' ');
      const firstName = names[0] || 'Client';
      const lastName = names.slice(1).join(' ') || 'Funnel';

      const placed = placeOrder(
        {
          firstName,
          lastName,
          email: email.trim(),
          phone: phone.trim() || 'Non renseigné',
          wilaya: locale === 'dz' ? '16 - Alger' : 'International',
          city: locale === 'sa' ? 'Riyadh' : locale === 'ae' ? 'Dubai' : 'Client Meta Ads',
          address: 'Livraison digitale immédiate',
          notes: `[Meta/TikTok Funnel: ${product.title}] Pack: ${selectedPack.name}${hasOrderBump ? ' + Bump VIP 1 An' : ''}${transactionRef ? ' | Réf BaridiMob: ' + transactionRef : ''}`,
        },
        0,
        paymentMethod,
        dialectData.currency,
        gtw,
        paymentMethod === 'baridimob' ? proofUrl : undefined
      );

      setIsSubmitting(false);

      // Save order metadata in sessionStorage for the upsell and thank you steps
      try {
        sessionStorage.setItem('novalys_funnel_order_id', placed.id);
        sessionStorage.setItem('novalys_funnel_product_slug', product.slug);
        sessionStorage.setItem('novalys_funnel_has_bump', hasOrderBump ? '1' : '0');
        sessionStorage.setItem('novalys_funnel_locale', locale);
      } catch {
        // ignore
      }

      // Transition to Step 2: One-Click Upsell
      router.push(`/f/${product.slug}/upsell?orderId=${placed.id}&locale=${locale}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      {/* 1. TOP DISTRACTION-FREE HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
        {/* Top Urgency Bar */}
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-cyan-600 text-slate-950 py-1.5 px-3 text-center text-[11px] sm:text-xs font-black tracking-wide flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-slate-950" />
          <span>{dialectData.bannerNotice}</span>
          <span className="hidden sm:inline font-mono font-bold bg-slate-950/20 px-2 py-0.5 rounded">
            Fin de l&apos;offre dans : {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Brand & Region Selector */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-black text-sm tracking-wider text-white">NOVALYS</span>
              <span className="text-[10px] text-cyan-400 ml-1.5 uppercase font-bold tracking-widest">OFFICIAL</span>
            </div>
          </div>

          {/* Region / Dialect Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handleLocaleSwitch('dz')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                locale === 'dz'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇩🇿</span>
              <span className="hidden md:inline">Algérie (DZD)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocaleSwitch('sa')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                locale === 'sa'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇸🇦</span>
              <span className="hidden md:inline">السعودية (SAR)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocaleSwitch('ae')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                locale === 'ae'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇦🇪</span>
              <span className="hidden md:inline">UAE (AED)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocaleSwitch('intl')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                locale === 'intl'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌐</span>
              <span className="hidden md:inline">Global (USD)</span>
            </button>
          </div>

          {/* Secure Trust Guarantee Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité SSL 256-bit</span>
          </div>
        </div>
      </header>

      {/* 2. HERO LANDING CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Scarcity & Countdown Alert Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              <strong className="text-rose-400 uppercase tracking-wide">Stock Critique :</strong> Plus que <span className="font-mono text-white underline font-extrabold">{product.stockRemaining} clés</span> disponibles au tarif publicitaire spécial.
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-amber-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Tarif garanti pendant : {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main Product Showcase & Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Value, Highlights & Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Badge */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20">
                  {product.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Livraison en 30 secondes
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                {product.subtitle}
              </p>

              {/* Dialect Localized Pitch */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="italic leading-relaxed">{dialectData.heroPitch}</p>
              </div>

              {/* Star Rating Social Proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white font-mono">{product.rating} / 5</span>
                <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString()} avis certifiés)</span>
              </div>
            </div>

            {/* Product Visual Mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-mono bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 font-bold">
                  Clé CD Digitale Officielle
                </span>
                <span className="font-bold bg-emerald-500/90 text-slate-950 px-3 py-1.5 rounded-xl shadow-lg">
                  Activation Garantie 100%
                </span>
              </div>
            </div>

            {/* Key Value Points */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Ce qui est inclus avec votre commande :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Social Proof in Authenticated Local Dialect */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  Avis Récents ({dialectData.countryName})
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Avis 100% Vérifiés
                </span>
              </div>

              <div className="space-y-3">
                {dialectData.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{rev.name}</p>
                          <p className="text-[10px] text-slate-400">{rev.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{rev.timeAgo}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{rev.verifiedMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Contextual Checkout Box (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="bg-[#0e1626] rounded-3xl border-2 border-cyan-500/40 p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 space-y-6">
              {/* Header Box Price */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tarif Promotionnel Flash :
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase">
                    -{selectedPack?.discountPercent || 70}% Économisés
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono tracking-tight">
                    {formatPrice(packPrice, dialectData.currency)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono line-through">
                    {formatPrice(Math.round(packPrice * 2.8), dialectData.currency)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  {dialectData.paymentNotice}
                </p>
              </div>

              {/* 1. Pack Duration Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Choisissez votre Formule :
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">Livraison Immédiate</span>
                </label>

                <div className="space-y-2">
                  {product.packs.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    const calculatedPrice = Math.round(basePriceInCurrency * pack.multiplier);

                    return (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{pack.name}</span>
                              {pack.badge && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                                  {pack.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{pack.durationLabel}</div>
                          </div>
                        </div>

                        <div className="text-right font-mono font-bold text-sm text-cyan-300">
                          {formatPrice(calculatedPrice, dialectData.currency)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Interactive Order Bump (Micro-Upsell) */}
              <div className="pt-2">
                <FunnelOrderBump
                  region={locale}
                  currency={dialectData.currency}
                  isSelected={hasOrderBump}
                  onToggle={setHasOrderBump}
                  formatPrice={formatPrice}
                />
              </div>

              {/* 3. Streamlined Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                {/* Email (Critical for Key Delivery) */}
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-bold flex items-center justify-between">
                    <span>Adresse E-mail pour recevoir votre Clé *</span>
                    <span className="text-[10px] text-rose-400 font-normal">Obligatoire</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@gmail.com"
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                  />
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Nom / Prénom *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Mohamed Larbi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Numéro WhatsApp / Téléphone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +213 550 12 34 56"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Payment Gateway Contextual Selection */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Mode de Paiement Sécurisé :
                  </label>

                  {/* ALGERIA: BARIDIMOB / CCP */}
                  {dialectData.currency === 'DZD' && (
                    <div className="space-y-3 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Coordonnées Officielles BaridiMob</span>
                        </span>
                        <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
                          Algérie Poste
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-semibold">Numéro RIP BaridiMob :</span>
                          <div className="flex items-center justify-between gap-1.5 mt-0.5">
                            <strong className="font-mono text-amber-300 text-xs font-bold tracking-wider select-all">
                              {paymentGateways.baridimob?.credentials?.accountRip || '007 99999 0023456789 42'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => {
                                const rawRip = (paymentGateways.baridimob?.credentials?.accountRip || '00799999002345678942').replace(/\s+/g, '');
                                navigator.clipboard.writeText(rawRip);
                                setCopiedRip(true);
                                showToast('Numéro RIP copié !', 'success');
                                setTimeout(() => setCopiedRip(false), 2000);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                            >
                              {copiedRip ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>Copier le RIP</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Titulaire :</span>
                          <span className="font-semibold text-white truncate max-w-[200px]" title={paymentGateways.baridimob?.credentials?.accountHolder || 'NOVALYS'}>
                            {paymentGateways.baridimob?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES (ALGÉRIE)'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                        1. Effectuez le virement BaridiMob vers le RIP ci-dessus.
                        <br />
                        <span className="text-amber-300 font-medium">
                          2. Cliquez sur &laquo; Commander &raquo; pour joindre la capture de votre reçu et débloquer votre clé !
                        </span>
                      </div>
                    </div>
                  )}

                  {/* GULF / INTERNATIONAL: BUTTONS (Apple Pay, mada, Stripe, PayPal) */}
                  {dialectData.currency !== 'DZD' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod(locale === 'sa' ? 'mada' : 'stripe')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'mada' || paymentMethod === 'stripe'
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{locale === 'sa' ? 'مدى / البطاقات' : 'Carte Bancaire'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'apple_pay'
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>🍏</span>
                        <span>Apple Pay</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{selectedPack.name} :</span>
                    <span className="font-mono text-white font-semibold">
                      {formatPrice(packPrice, dialectData.currency)}
                    </span>
                  </div>
                  {hasOrderBump && (
                    <div className="flex items-center justify-between text-amber-300 text-[11px]">
                      <span>Garantie VIP Remplacement 1 An :</span>
                      <span className="font-mono font-bold">
                        +{formatPrice(bumpPrice, dialectData.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                    <span>Total à Payer :</span>
                    <span className="font-mono text-cyan-300 text-lg">
                      {formatPrice(finalTotalAmount, dialectData.currency)}
                    </span>
                  </div>
                </div>

                {/* High Converting Primary CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <Lock className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>
                    {isSubmitting
                      ? 'Sécurisation de la commande...'
                      : dialectData.currency === 'DZD'
                      ? `Valider mon Virement BaridiMob (${formatPrice(finalTotalAmount, dialectData.currency)})`
                      : `Obtenir ma Clé Immédiatement (${formatPrice(finalTotalAmount, dialectData.currency)})`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                </button>

                {/* Sub-CTA Trust Guarantees */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Paiement 100% Chiffré SSL
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Clé CD Officielle en 30s
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 3. STEP-BY-STEP ACTIVATION GUIDE PREVIEW */}
        <section className="bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
              Procédure Simplifiée
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Comment activer votre produit en 3 étapes ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Aucune compétence technique nécessaire. Vous recevez un guide complet avec votre clé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.activationSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 relative space-y-2 hover:border-cyan-500/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-sm flex items-center justify-center border border-cyan-500/40">
                  {step.step}
                </div>
                <h3 className="text-sm font-bold text-white pt-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. REASSURING FOOTER (With discrete link to the full store catalog) */}
        <footer className="pt-8 border-t border-slate-900 text-center space-y-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantie Satisfait ou Remplacé
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              Paiements Sécurisés Stripe &amp; BaridiMob
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Support WhatsApp 7j/7
            </span>
          </div>

          <p className="max-w-xl mx-auto text-[11px] text-slate-500 leading-relaxed">
            NOVALYS Marketplace Digitale Officielle. Clés CD authentiques distribuées sous accords de licence de distribution officielle. Tous les noms de marques déposées appartiennent à leurs propriétaires respectifs.
          </p>

          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
            >
              <span>Explorer notre boutique officielle complète</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
