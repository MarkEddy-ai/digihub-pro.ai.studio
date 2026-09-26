'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Currency, Order } from '@/types';
import {
  FUNNEL_UPSELL_OFFER,
  FunnelLocale,
  LOCALIZED_DIALECT_DATA,
  getFunnelProductBySlug,
} from '@/data/funnelOffers';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  X,
  AlertTriangle,
  Gift,
} from 'lucide-react';

interface FunnelOneClickUpsellProps {
  slug: string;
}

export function FunnelOneClickUpsell({ slug }: FunnelOneClickUpsellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, formatPrice, selectedCurrency, addUpsellToOrder, showToast } = useShop();

  // Retrieve params
  const orderId = searchParams.get('orderId') || '';
  const locale = (searchParams.get('locale') as FunnelLocale) || 'dz';
  const dialectData = LOCALIZED_DIALECT_DATA[locale] || LOCALIZED_DIALECT_DATA.dz;

  const mainProduct = getFunnelProductBySlug(slug);
  const upsell = FUNNEL_UPSELL_OFFER;

  // 5-minute countdown timer (04:59)
  const [timeLeft, setTimeLeft] = useState({ minutes: 4, seconds: 59 });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Price in locale currency
  const upsellPrice = useMemo(() => {
    switch (dialectData.currency) {
      case 'DZD':
        return upsell.priceDzd;
      case 'SAR':
        return upsell.priceSar;
      case 'AED':
        return upsell.priceAed;
      default:
        return upsell.priceUsd;
    }
  }, [upsell, dialectData.currency]);

  // Handle Accept Upsell (1-Click Add)
  const handleAcceptUpsell = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Add upsell to order in context
      if (orderId) {
        addUpsellToOrder(orderId, {
          productId: upsell.productId,
          title: upsell.title[locale] || upsell.title.intl,
          price: upsellPrice,
          image: upsell.image,
        });
      }

      showToast('Office 2024 Pro Plus ajouté à votre commande avec 70% de réduction !', 'success');
      setIsProcessing(false);

      // Save upsell accepted in session
      try {
        sessionStorage.setItem('novalys_funnel_upsell_accepted', '1');
      } catch {
        // ignore
      }

      router.push(`/f/${slug}/thank-you?orderId=${orderId}&locale=${locale}&upsell=1`);
    }, 800);
  };

  // Handle Decline Upsell (Skip)
  const handleDeclineUpsell = () => {
    try {
      sessionStorage.setItem('novalys_funnel_upsell_accepted', '0');
    } catch {
      // ignore
    }
    router.push(`/f/${slug}/thank-you?orderId=${orderId}&locale=${locale}&upsell=0`);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-3xl w-full bg-[#0c1424] border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Top Scarcity Alert Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-3 sm:p-4 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wide">
            <AlertTriangle className="w-5 h-5 fill-slate-950 text-amber-300" />
            <span>ATTENDEZ ! VOTRE COMMANDE N&apos;EST PAS ENCORE TERMINÉE</span>
          </div>

          <div className="bg-slate-950 text-amber-300 font-mono font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-inner">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Offre expire dans : {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Headline Pitch */}
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              Offre Unique Réservée aux Nouveaux Clients (-70%)
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {upsell.headline[locale] || upsell.headline.intl}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {upsell.description[locale] || upsell.description.intl}
            </p>
          </div>

          {/* Product Upsell Presentation Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 shadow-inner">
            <div className="relative w-full sm:w-48 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-900">
              <img
                src={upsell.image}
                alt="Office 2024 Pro Plus"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase shadow-md">
                -70% OFF
              </span>
            </div>

            <div className="space-y-3 flex-1 text-left w-full">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {upsell.title[locale] || upsell.title.intl}
                </h3>
                <p className="text-xs text-slate-400">
                  Licence Retail permanente liée à votre compte Microsoft officiel
                </p>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {upsell.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price Highlight */}
              <div className="pt-2 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {formatPrice(upsellPrice, dialectData.currency)}
                </span>
                <span className="text-xs text-slate-500 line-through font-mono">
                  {formatPrice(Math.round(upsellPrice * 3.3), dialectData.currency)}
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  (Paiement unique à vie • Zéro abonnement)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary One-Click Accept Button */}
            <button
              onClick={handleAcceptUpsell}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
              <span>
                {isProcessing
                  ? 'Ajout en cours à votre commande...'
                  : `OUI ! Ajouter Office 2024 Pro à ma commande en 1 clic (${formatPrice(upsellPrice, dialectData.currency)})`}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            {/* Reassuring Guarantee under CTA */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantie Satisfait ou Remboursé
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Délivré instantanément avec votre clé
              </span>
            </div>

            {/* Discrete Decline Link */}
            <div className="text-center pt-2">
              <button
                onClick={handleDeclineUpsell}
                className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-4 transition-colors font-medium cursor-pointer"
              >
                Non merci, je renonce à cette réduction de 70% et je passe directement à ma commande &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
