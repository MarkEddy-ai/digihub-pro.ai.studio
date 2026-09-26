'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { TrafficSourceId } from '@/types';
import { FUNNEL_PRODUCTS } from '@/data/funnelOffers';
import {
  TrendingUp,
  Percent,
  Flame,
  Zap,
  Globe2,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Copy,
  Check,
  RefreshCw,
  Calendar,
  DollarSign,
} from 'lucide-react';

type DateRangeOption = 'today' | '7days' | '30days';

interface DailySaleRecord {
  date: string;
  formattedDate: string;
  views: number;
  checkouts: number;
  orders: number;
  grossRevenue: number;
  conversionRate: number;
}

export function AdminAnalyticsDashboard() {
  const {
    analyticsSummary,
    simulateBatchTraffic,
    resetAnalyticsData,
    showToast,
  } = useShop();

  const [dateRange, setDateRange] = useState<DateRangeOption>('7days');

  // Campaign URL Generator state
  const [genProduct, setGenProduct] = useState(FUNNEL_PRODUCTS[0]?.slug || 'windows-11-pro-retail');
  const [genSource, setGenSource] = useState<TrafficSourceId>('tiktok_ads');
  const [genLocale, setGenLocale] = useState('dz');
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate granular daily data according to selected dateRange
  const dailyPerformanceData = useMemo<DailySaleRecord[]>(() => {
    const daysCount = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : 30;
    const records: DailySaleRecord[] = [];
    const now = new Date();

    const baseRevenue = analyticsSummary.totalRevenueUsd || 1480;
    const baseOrders = analyticsSummary.totalOrders || 52;
    const baseVisits = analyticsSummary.totalVisits || 640;

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const formattedDate = d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        ...(daysCount === 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
      });

      // Factor variations by day of week
      const dayFactor = 0.75 + (((d.getDate() * 17) % 50) / 100);
      const dailyViews = Math.max(Math.round((baseVisits / daysCount) * dayFactor), 12);
      const dailyOrders = Math.max(Math.round((baseOrders / daysCount) * dayFactor), 1);
      const dailyCheckouts = Math.round(dailyViews * 0.28);
      const dailyRevenue = parseFloat(((baseRevenue / daysCount) * dayFactor).toFixed(2));
      const dailyCr = parseFloat(((dailyOrders / dailyViews) * 100).toFixed(1));

      records.push({
        date: isoDate,
        formattedDate,
        views: dailyViews,
        checkouts: dailyCheckouts,
        orders: dailyOrders,
        grossRevenue: dailyRevenue,
        conversionRate: dailyCr,
      });
    }

    return records;
  }, [dateRange, analyticsSummary]);

  // Aggregated KPIs for selected dateRange
  const currentRangeStats = useMemo(() => {
    const totalViews = dailyPerformanceData.reduce((s, r) => s + r.views, 0);
    const totalCheckouts = dailyPerformanceData.reduce((s, r) => s + r.checkouts, 0);
    const totalOrders = dailyPerformanceData.reduce((s, r) => s + r.orders, 0);
    const totalRevenue = dailyPerformanceData.reduce((s, r) => s + r.grossRevenue, 0);
    const avgCr = totalViews > 0 ? parseFloat(((totalOrders / totalViews) * 100).toFixed(1)) : 0;
    const aov = totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0;

    return {
      totalViews,
      totalCheckouts,
      totalOrders,
      totalRevenue,
      avgCr,
      aov,
    };
  }, [dailyPerformanceData]);

  // Chart max value calculation
  const maxDailyRevenue = Math.max(...dailyPerformanceData.map((d) => d.grossRevenue), 100);

  const generatedUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/f/${genProduct}?locale=${genLocale}&utm_source=${genSource}`
      : `/f/${genProduct}?locale=${genLocale}&utm_source=${genSource}`;

  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    showToast('URL de campagne publicitaire avec UTMs copiée !', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Range Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              Tableau de Bord CRO &amp; Analytics Funnels
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Indicateurs de conversion, revenus journaliers et ratios de trafic par canal publicitaire.
          </p>
        </div>

        {/* Date-Range Selector & Batch Simulator */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === 'today'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aujourd&apos;hui
            </button>
            <button
              type="button"
              onClick={() => setDateRange('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === '7days'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Derniers Jours
            </button>
            <button
              type="button"
              onClick={() => setDateRange('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === '30days'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Derniers Jours
            </button>
          </div>

          {/* Quick Simulation */}
          <button
            type="button"
            onClick={() => simulateBatchTraffic('tiktok_ads', 30, 'windows-11-pro-retail')}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Simuler 30 visites TikTok"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+30 Visiteurs TikTok</span>
          </button>

          <button
            type="button"
            onClick={resetAnalyticsData}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Réinitialiser l'échantillon"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. EXECUTIVE KPI MATRIX FOR SELECTED RANGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Taux de Conversion */}
        <div className="bg-[#0e1626] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Taux de Conversion (CR)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight tabular-nums">
              {currentRangeStats.avgCr}%
            </span>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Optimisé CRO</span>
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Visiteurs uniques :</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {currentRangeStats.totalViews.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 2: Commandes Passées */}
        <div className="bg-[#0e1626] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Commandes Finalisées
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300 font-mono tracking-tight tabular-nums">
              {currentRangeStats.totalOrders}
            </span>
            <span className="text-xs text-slate-400 font-medium">ventes</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Panier Moyen (AOV) :</span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">
              ${currentRangeStats.aov}
            </span>
          </div>
        </div>

        {/* KPI 3: Chiffre d'Affaires Brut */}
        <div className="bg-[#0e1626] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Revenus Bruts ({dateRange === 'today' ? 'Jour' : dateRange === '7days' ? '7 Jours' : '30 Jours'})
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-300 font-mono tracking-tight tabular-nums">
              ${currentRangeStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              {analyticsSummary.estimatedRoas}x ROAS
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Projection mensuelle :</span>
            <span className="font-mono font-bold text-white tabular-nums">
              ${(currentRangeStats.totalRevenue * (30 / dailyPerformanceData.length)).toFixed(0)}
            </span>
          </div>
        </div>

        {/* KPI 4: Order Bump & Upsell */}
        <div className="bg-[#0e1626] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Attachement Bump &amp; Upsell
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">Order Bump VIP :</span>
              <span className="text-xl font-black text-amber-400 font-mono tabular-nums">
                {analyticsSummary.bumpTakeRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">One-Click Upsell :</span>
              <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                {analyticsSummary.upsellTakeRate}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Valeur ajoutée :</span>
            <span className="text-amber-300 font-bold">+35% de marge nette</span>
          </div>
        </div>
      </div>

      {/* 2. CONVERSION FUNNEL VISUALIZER & DAILY REVENUE TRENDS LINE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FUNNEL VISUALIZER (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0e1626] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Visualiseur de Funnel (Entonnoir de Vente)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Déperdition et conversion à chaque palier du tunnel d&apos;achat.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Step 1: Views */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] flex items-center justify-center font-bold">
                    1
                  </span>
                  Visiteurs Landing Page (View)
                </span>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">
                  {currentRangeStats.totalViews} (100%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full" />
              </div>
            </div>

            {/* Drop 1 */}
            <div className="flex items-center justify-center text-[10px] text-slate-500 font-mono">
              <span>&darr; 28% initient un paiement</span>
            </div>

            {/* Step 2: Checkout */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[11px] flex items-center justify-center font-bold">
                    2
                  </span>
                  Clic &quot;Acheter&quot; &amp; Formulaire (Checkout)
                </span>
                <span className="font-mono font-bold text-indigo-300 tabular-nums">
                  {currentRangeStats.totalCheckouts} (
                  {currentRangeStats.totalViews > 0
                    ? Math.round((currentRangeStats.totalCheckouts / currentRangeStats.totalViews) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{
                    width: `${
                      currentRangeStats.totalViews > 0
                        ? (currentRangeStats.totalCheckouts / currentRangeStats.totalViews) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Drop 2 */}
            <div className="flex items-center justify-center text-[10px] text-slate-500 font-mono">
              <span>&darr; 30% des checkouts convertissent</span>
            </div>

            {/* Step 3: Conversion */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] flex items-center justify-center font-bold">
                    3
                  </span>
                  Paiement Validé &amp; Clé Délivrée (Conversion)
                </span>
                <span className="font-mono font-black text-emerald-400 tabular-nums">
                  {currentRangeStats.totalOrders} ({currentRangeStats.avgCr}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{
                    width: `${Math.min(currentRangeStats.avgCr * 5, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY REVENUE TRENDS LINE / AREA CHART (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0e1626] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Courbe d&apos;Évolution du Chiffre d&apos;Affaires Journalier
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Progression du chiffre d&apos;affaires généré (USD) sur la période sélectionnée.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Max : ${maxDailyRevenue.toFixed(0)}
            </span>
          </div>

          {/* SVG Line / Bar Chart */}
          <div className="pt-2">
            <div className="h-52 w-full flex items-end gap-1.5 sm:gap-2 px-2 pb-6 pt-4 bg-slate-950/80 rounded-xl border border-slate-800 relative">
              {/* Background horizontal grid lines */}
              <div className="absolute inset-x-2 top-6 border-b border-slate-800/40" />
              <div className="absolute inset-x-2 top-24 border-b border-slate-800/40" />
              <div className="absolute inset-x-2 top-40 border-b border-slate-800/40" />

              {dailyPerformanceData.map((d, index) => {
                const heightPercent = maxDailyRevenue > 0 ? (d.grossRevenue / maxDailyRevenue) * 100 : 0;
                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 border border-cyan-500/50 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl pointer-events-none">
                      <span className="font-mono font-bold text-cyan-300 tabular-nums">
                        ${d.grossRevenue.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-[9px]">{d.orders} commandes</span>
                    </div>

                    {/* Bar with gradient */}
                    <div
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600/50 via-cyan-500 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                    />

                    {/* X-axis label */}
                    <span className="absolute -bottom-5 text-[9px] font-mono text-slate-500 group-hover:text-cyan-300 truncate w-full text-center">
                      {d.formattedDate.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILED DAILY SALES PERFORMANCE TABLE WITH TABULAR-NUMS */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Performances Journalières Détaillées (Daily Sales Performance)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historique granulaire avec Date, Visites, Commandes, CA Brut et Taux de Conversion en format tabulaire.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Visites (Views)</th>
                <th className="py-3 px-4 text-right">Checkouts Initiés</th>
                <th className="py-3 px-4 text-right">Commandes (Orders)</th>
                <th className="py-3 px-4 text-right">CA Brut (Gross Revenue)</th>
                <th className="py-3 px-4 text-right">Taux de Conv. (CR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {dailyPerformanceData.map((row) => (
                <tr key={row.date} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300 font-bold tabular-nums">
                    {row.formattedDate}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    {row.views.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-400 tabular-nums">
                    {row.checkouts.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                      {row.orders}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-black text-emerald-400 tabular-nums">
                    ${row.grossRevenue.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        row.conversionRate >= 8
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : row.conversionRate >= 5
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {row.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table Summary Footer */}
            <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700 text-white">
              <tr>
                <td className="py-3 px-4 text-slate-400 uppercase text-[10px]">Total Sélectionné</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                  {currentRangeStats.totalViews.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                  {currentRangeStats.totalCheckouts.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-cyan-400 font-black">
                  {currentRangeStats.totalOrders}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-black">
                  ${currentRangeStats.totalRevenue.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-300 font-black">
                  {currentRangeStats.avgCr}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 4. TRAFFIC SOURCES BREAKDOWN TABLE */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            Performances par Source de Trafic (Meta, TikTok, Reels)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi des canaux publicitaires, volume de clics, ventes et rentabilité publicitaire (ROAS).
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Canal Publicitaire</th>
                <th className="py-3 px-3">Type Campagne</th>
                <th className="py-3 px-3 text-right">Visites</th>
                <th className="py-3 px-3 text-right">Commandes</th>
                <th className="py-3 px-3 text-right">Taux Conv.</th>
                <th className="py-3 px-3 text-right">Ratio Visite/Vente</th>
                <th className="py-3 px-3 text-right">CA Généré</th>
                <th className="py-3 px-3 text-right">ROAS Estimé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {analyticsSummary.sources.map((src) => {
                const visitShare =
                  analyticsSummary.totalVisits > 0
                    ? Math.round((src.visits / analyticsSummary.totalVisits) * 100)
                    : 0;

                return (
                  <tr key={src.sourceId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: src.color }}
                        />
                        <span className="font-bold text-white text-xs">{src.label}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">{src.channel}</td>

                    <td className="py-3 px-3 text-right font-mono text-slate-200 tabular-nums">
                      <span>{src.visits}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({visitShare}%)</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {src.orders}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          src.conversionRate >= 8
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : src.conversionRate >= 5
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {src.conversionRate}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-cyan-300 font-semibold tabular-nums">
                      {src.visitToOrderRatio}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-white tabular-nums">
                      ${src.revenueUsd.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          src.roas >= 3.5
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : src.roas >= 2.0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {src.roas > 0 ? `${src.roas}x` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CAMPAIGN UTM URL GENERATOR */}
      <div className="bg-gradient-to-br from-[#0e1626] via-slate-900 to-[#0e1626] rounded-2xl border-2 border-cyan-500/40 p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Générateur d&apos;URLs de Campagnes Publicitaires (UTM Tracking)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Générez des liens personnalisés pour vos publicités TikTok, Facebook, Instagram et influenceurs afin de tracker automatiquement vos conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Produit du Funnel :
            </label>
            <select
              value={genProduct}
              onChange={(e) => setGenProduct(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {FUNNEL_PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Canal Publicitaire (UTM Source) :
            </label>
            <select
              value={genSource}
              onChange={(e) => setGenSource(e.target.value as TrafficSourceId)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="tiktok_ads">TikTok Ads (Spark / Video)</option>
              <option value="meta_ads">Meta Ads (Facebook Feed)</option>
              <option value="instagram_reels">Instagram Reels Ads</option>
              <option value="google_ads">Google Search / PMax</option>
              <option value="influencer_affiliate">Influenceurs / Créateurs</option>
              <option value="direct">Direct / Partage Réseaux</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Région &amp; Dialecte Cible :
            </label>
            <select
              value={genLocale}
              onChange={(e) => setGenLocale(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="dz">🇩🇿 Algérie (BaridiMob &amp; Darija - DZD)</option>
              <option value="sa">🇸🇦 Arabie Saoudite (mada &amp; Khaliji - SAR)</option>
              <option value="ae">🇦🇪 Émirats Arabes Unis (Apple Pay - AED)</option>
              <option value="intl">🌐 International (Stripe &amp; PayPal - USD)</option>
            </select>
          </div>
        </div>

        {/* Generated URL & Copy Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <input
            type="text"
            readOnly
            value={generatedUrl}
            className="w-full flex-1 bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono select-all focus:outline-none"
          />

          <button
            type="button"
            onClick={handleCopyGenerated}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Lien Copié !' : 'Copier l\'URL de Campagne'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
