'use client';

import React from 'react';
import { Currency } from '@/types';
import { FUNNEL_ORDER_BUMP, FunnelLocale } from '@/data/funnelOffers';
import { ShieldCheck, Sparkles, Check, Flame } from 'lucide-react';

interface FunnelOrderBumpProps {
  region: FunnelLocale;
  currency: Currency;
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
  formatPrice: (amount: number, currency: Currency) => string;
}

export function FunnelOrderBump({
  region,
  currency,
  isSelected,
  onToggle,
  formatPrice,
}: FunnelOrderBumpProps) {
  // Determine localized bump price
  const bumpPrice =
    currency === 'DZD'
      ? FUNNEL_ORDER_BUMP.priceDzd
      : currency === 'SAR'
      ? FUNNEL_ORDER_BUMP.priceSar
      : currency === 'AED'
      ? FUNNEL_ORDER_BUMP.priceAed
      : currency === 'KWD'
      ? FUNNEL_ORDER_BUMP.priceKwd
      : FUNNEL_ORDER_BUMP.priceUsd;

  const titleText = FUNNEL_ORDER_BUMP.title[region] || FUNNEL_ORDER_BUMP.title.intl;
  const descText = FUNNEL_ORDER_BUMP.description[region] || FUNNEL_ORDER_BUMP.description.intl;

  return (
    <div
      onClick={() => onToggle(!isSelected)}
      className={`relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 select-none ${
        isSelected
          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/30 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.01]'
          : 'bg-slate-950/80 hover:bg-slate-900 border-dashed border-amber-500/50 hover:border-amber-400'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="absolute -top-3.5 left-4 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md animate-pulse">
        <Flame className="w-3 h-3 text-slate-950 fill-current" />
        <span>87% des acheteurs choisissent cette option</span>
      </div>

      <div className="flex items-start gap-3.5 pt-1">
        {/* Custom Styled Checkbox */}
        <div className="pt-0.5 shrink-0">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2 ${
              isSelected
                ? 'bg-amber-400 border-amber-400 text-slate-950 scale-110 shadow-md shadow-amber-400/30'
                : 'border-slate-600 bg-slate-900 text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs sm:text-sm font-black text-amber-300 leading-snug flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 inline" />
              <span>{titleText}</span>
            </h4>
            <span className="font-mono font-black text-sm text-emerald-400 whitespace-nowrap bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 self-start sm:self-auto">
              +{formatPrice(bumpPrice, currency)}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            {descText}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[10px] text-amber-400/90 font-medium">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>Remplacement en 15 min garanti • Priorité WhatsApp 365 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
