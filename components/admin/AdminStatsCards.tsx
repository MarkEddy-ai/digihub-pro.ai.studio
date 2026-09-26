'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Currency } from '@/types';
import { SUPPORTED_CURRENCIES } from '@/data/paymentGateways';
import {
  TrendingUp,
  DollarSign,
  KeyRound,
  AlertTriangle,
  Clock,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Globe2,
} from 'lucide-react';

interface AdminStatsCardsProps {
  onNavigateToVault: () => void;
  onNavigateToOrders: () => void;
}

export function AdminStatsCards({ onNavigateToVault, onNavigateToOrders }: AdminStatsCardsProps) {
  const { adminStats, products, formatPrice } = useShop();

  const [activeCurrencyTab, setActiveCurrencyTab] = useState<'all' | 'DZD' | 'SAR' | 'USD' | 'KWD' | 'AED'>('all');

  // Find products with stock < 3
  const criticalProducts = products.filter((p) => p.stockCount < 3);

  return (
    <div className="space-y-4">
      {/* Critical Stock Alert Banner if any product < 3 units */}
      {criticalProducts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border border-rose-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-rose-400">
                  ALERTE STOCK CRITIQUE (&lt; 3 UNITÉS)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/50">
                  {criticalProducts.length} produit{criticalProducts.length > 1 ? 's' : ''} concerné{criticalProducts.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Certains produits ont moins de 3 clés disponibles dans le coffre. Réapprovisionnez avant rupture :
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {criticalProducts.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-900/90 text-slate-200 border border-rose-500/40"
                  >
                    <span className="font-semibold text-rose-300">{p.title || p.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500/30 text-rose-200">
                      {p.stockCount} clé{p.stockCount > 1 ? 's' : ''} restante{p.stockCount > 1 ? 's' : ''}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToVault}
            className="sm:self-center px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105 shrink-0 flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4" />
            Insérer des clés en masse
          </button>
        </div>
      )}

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chiffre d'Affaires Global Converti & Découpé par Devise */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-cyan-400" />
              Chiffre d&apos;Affaires Global
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              Converti USD
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300 font-mono tracking-tight">
              ${adminStats.totalRevenueUsdConverted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>

          {/* Quick breakdown preview */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">🇩🇿 Algérie :</span>
              <span className="font-mono font-bold text-white">
                {Math.round(adminStats.revenueByCurrency.DZD).toLocaleString('fr-FR')} DA
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">🇸🇦 Arabie S. :</span>
              <span className="font-mono font-bold text-slate-200">
                {adminStats.revenueByCurrency.SAR.toLocaleString('fr-FR')} SAR
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">🇰🇼 Koweït :</span>
              <span className="font-mono font-bold text-slate-200">
                {adminStats.revenueByCurrency.KWD.toLocaleString('fr-FR')} KWD
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Clés Restantes en Stock (Coffre) */}
        <div
          onClick={onNavigateToVault}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stock de Clés Restantes
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {adminStats.totalKeysRemaining}
            </span>
            <span className="text-xs text-indigo-400 font-medium">unités disponibles</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sous surveillance :</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <span>{products.length} produits actifs</span>
              <ArrowUpRight className="w-3 h-3 text-indigo-400" />
            </span>
          </div>
        </div>

        {/* Card 3: Commandes en attente de vérification (BaridiMob) */}
        <div
          onClick={onNavigateToOrders}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Attente BaridiMob / CCP
            </span>
            <div className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${
              adminStats.pendingOrders > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono tracking-tight ${
              adminStats.pendingOrders > 0 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {adminStats.pendingOrders}
            </span>
            <span className="text-xs text-slate-400 font-medium">à inspecter</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Action requise :</span>
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <span>Valider les reçus</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Bénéfice net estimé (Prix vente - Coût source Plati en USD) */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Marge Bénéficiaire Nette
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              +${adminStats.estimatedNetProfitUsd.toFixed(1)}
            </span>
            <span className="text-xs text-emerald-500 font-semibold font-mono">USD Net</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Coûts fournisseurs :</span>
            <span className="font-semibold text-slate-300">Plati / GGsel déduits</span>
          </div>
        </div>
      </div>

      {/* Multi-Currency Revenue Matrix Bar */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Répartition du CA par Devise :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(SUPPORTED_CURRENCIES) as Currency[]).map((cCode) => {
            const cur = SUPPORTED_CURRENCIES[cCode];
            const amount = adminStats.revenueByCurrency[cCode] || 0;
            if (amount === 0 && !['DZD', 'SAR', 'USD', 'KWD', 'AED'].includes(cCode)) return null;

            return (
              <div
                key={cCode}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5"
              >
                <span>{cur.flag}</span>
                <span className="text-[11px] text-slate-400">{cCode}:</span>
                <span className="text-xs font-mono font-bold text-white">
                  {formatPrice(amount, cCode)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

