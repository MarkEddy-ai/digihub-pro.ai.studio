'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Affiliate, AffiliateSale } from '@/types';
import {
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Percent,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  CreditCard,
  Send,
  MessageCircle,
} from 'lucide-react';

export function AffiliatesManager() {
  const {
    affiliates,
    affiliateSales,
    validateAffiliatePayout,
    updateAffiliateCommissionRate,
    registerAffiliate,
    globalAffiliateCommissionRate,
    setGlobalAffiliateCommissionRate,
    showToast,
    formatPrice,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | Affiliate['platform']>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [payoutModalAffiliate, setPayoutModalAffiliate] = useState<Affiliate | null>(null);
  const [payoutProofNote, setPayoutProofNote] = useState('');

  // Form state for creating VIP partner
  const [newPartner, setNewPartner] = useState<{
    name: string;
    email: string;
    platform: Affiliate['platform'];
    socialHandle: string;
    payoutMethod: Affiliate['payoutMethod'];
    payoutDetails: string;
    customRate: number;
  }>({
    name: '',
    email: '',
    platform: 'tiktok',
    socialHandle: '',
    payoutMethod: 'baridimob',
    payoutDetails: '',
    customRate: 25,
  });

  // Global KPI calculations
  const totalRevenueUsd = affiliates.reduce((sum, a) => sum + (a.totalRevenueUsd || 0), 0);
  const totalCommissionUsd = affiliates.reduce((sum, a) => sum + (a.totalCommissionUsd || 0), 0);
  const totalPaidCommissionUsd = affiliates.reduce((sum, a) => sum + (a.paidCommissionUsd || 0), 0);
  const pendingPayoutUsd = Math.max(0, totalCommissionUsd - totalPaidCommissionUsd);
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const totalSalesCount = affiliates.reduce((sum, a) => sum + (a.salesCount || 0), 0);
  const globalConversionRate = totalClicks > 0 ? ((totalSalesCount / totalClicks) * 100).toFixed(1) : '0.0';

  // Filtered affiliates
  const filteredAffiliates = affiliates.filter((aff) => {
    const matchesSearch =
      aff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.socialHandle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || aff.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://novalys.shop';
    const link = `${origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    showToast(`Lien partenaire copié : ${link}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.email) {
      showToast('Veuillez remplir au moins le nom et l\'email.', 'warning');
      return;
    }

    const created = registerAffiliate({
      name: newPartner.name,
      email: newPartner.email,
      platform: newPartner.platform,
      socialHandle: newPartner.socialHandle || `${newPartner.name} VIP`,
      payoutMethod: newPartner.payoutMethod,
      payoutDetails: newPartner.payoutDetails || 'À confirmer avec l\'affilié',
    });

    if (newPartner.customRate !== 25) {
      updateAffiliateCommissionRate(created.id, newPartner.customRate / 100);
    }

    setIsNewPartnerModalOpen(false);
    setNewPartner({
      name: '',
      email: '',
      platform: 'tiktok',
      socialHandle: '',
      payoutMethod: 'baridimob',
      payoutDetails: '',
      customRate: 25,
    });
  };

  const handleConfirmPayout = () => {
    if (!payoutModalAffiliate) return;
    validateAffiliatePayout(payoutModalAffiliate.id);
    showToast(`Virement de ${formatPrice(payoutModalAffiliate.totalCommissionUsd - (payoutModalAffiliate.paidCommissionUsd || 0), 'USD')} validé pour ${payoutModalAffiliate.name} !`, 'success');
    setPayoutModalAffiliate(null);
    setPayoutProofNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              Gestion de l&apos;Affiliation &amp; Influenceurs
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              25% REVENUE SHARE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recrutez des créateurs TikTok, Meta et Telegram pour scaler vos ventes en automatique avec attribution par cookie 30 jours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/affilies"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>Page Publique Créateur</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => setIsNewPartnerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nouveau Partenaire VIP</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue Generated */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">CA Généré par Affiliés</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatPrice(totalRevenueUsd, 'USD')}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {totalSalesCount} ventes validées
            </span>
            <span className="font-mono text-slate-400">~{Math.round(totalRevenueUsd * 230).toLocaleString()} DZD</span>
          </div>
        </div>

        {/* Card 2: Commissions Due (Pending Payout) */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Commissions en Attente</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {formatPrice(pendingPayoutUsd, 'USD')}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Déjà versé : {formatPrice(totalPaidCommissionUsd, 'USD')}</span>
            <span className="text-amber-300/80 font-mono">
              ~{Math.round(pendingPayoutUsd * 230).toLocaleString()} DZD
            </span>
          </div>
        </div>

        {/* Card 3: Active Affiliates */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Partenaires Recrutés</span>
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {affiliates.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-indigo-400 font-medium">100% Actifs</span>
            <span>Taux moyen : {Math.round(globalAffiliateCommissionRate * 100)}%</span>
          </div>
        </div>

        {/* Card 4: Global Conversion Rate */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taux de Conversion Liens</span>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Share2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {globalConversionRate}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{totalClicks} clics trackés</span>
            <span className="text-cyan-400 font-medium">Cookie 30j</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e1626] p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher nom, code, email, compte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Réseau :</span>
          </span>
          {(['all', 'tiktok', 'instagram', 'telegram', 'youtube'] as const).map((plt) => (
            <button
              key={plt}
              type="button"
              onClick={() => setPlatformFilter(plt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                platformFilter === plt
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {plt === 'all' ? 'Tous' : plt}
            </button>
          ))}
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Tableau des Affiliés &amp; Créateurs ({filteredAffiliates.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Attribution automatique par paramètre d&apos;URL <code className="text-purple-300 font-mono bg-purple-950/50 px-1 py-0.5 rounded border border-purple-800/50">?ref=code</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a101d] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Affilié / Contact</th>
                <th className="py-3.5 px-4">Lien &amp; Code Réf</th>
                <th className="py-3.5 px-4">Plateforme &amp; Audience</th>
                <th className="py-3.5 px-4 text-center">Performance (Ventes / Clics)</th>
                <th className="py-3.5 px-4">CA Généré</th>
                <th className="py-3.5 px-4">Commission Due</th>
                <th className="py-3.5 px-4">Coordonnées Virement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAffiliates.map((aff) => {
                const pendingCommission = Math.max(0, (aff.totalCommissionUsd || 0) - (aff.paidCommissionUsd || 0));
                const convRate = aff.clicks > 0 ? ((aff.salesCount / aff.clicks) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={aff.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Name & Email */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{aff.name}</div>
                      <div className="text-[11px] text-slate-400">{aff.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          Taux : {Math.round(aff.commissionRate * 100)}%
                        </span>
                      </div>
                    </td>

                    {/* Code & Referral Link */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800/60">
                          {aff.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(aff.code)}
                          title="Copier le lien affilié"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          {copiedCode === aff.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        /?ref={aff.code}
                      </div>
                    </td>

                    {/* Platform & Audience */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-200 capitalize">
                        {aff.platform === 'tiktok' && '🎵 TikTok'}
                        {aff.platform === 'instagram' && '📸 Instagram'}
                        {aff.platform === 'telegram' && '✈️ Telegram'}
                        {aff.platform === 'youtube' && '▶️ YouTube'}
                        {!['tiktok', 'instagram', 'telegram', 'youtube'].includes(aff.platform) && '🌐 Autre'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">
                        {aff.socialHandle}
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-mono font-bold text-white text-sm">
                        {aff.salesCount} ventes
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {aff.clicks} clics ({convRate}%)
                      </div>
                    </td>

                    {/* CA Généré */}
                    <td className="py-4 px-4 font-mono font-semibold text-white">
                      <div>{formatPrice(aff.totalRevenueUsd, 'USD')}</div>
                      <div className="text-[10px] text-slate-500">
                        ~{Math.round(aff.totalRevenueUsd * 230).toLocaleString()} DZD
                      </div>
                    </td>

                    {/* Commission Due */}
                    <td className="py-4 px-4">
                      <div className={`font-mono font-black text-sm ${pendingCommission > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {formatPrice(pendingCommission, 'USD')}
                      </div>
                      {pendingCommission > 0 ? (
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          À payer (~{Math.round(pendingCommission * 230).toLocaleString()} DZD)
                        </span>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Tous soldes réglés
                        </span>
                      )}
                    </td>

                    {/* Payout Details */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="text-xs font-semibold text-slate-300 capitalize flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{aff.payoutMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate" title={aff.payoutDetails}>
                        {aff.payoutDetails}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pendingCommission > 0 && (
                          <button
                            type="button"
                            onClick={() => setPayoutModalAffiliate(aff)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
                          >
                            Payer
                          </button>
                        )}

                        <select
                          value={Math.round(aff.commissionRate * 100)}
                          onChange={(e) => updateAffiliateCommissionRate(aff.id, Number(e.target.value) / 100)}
                          className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 px-2 py-1.5 cursor-pointer focus:outline-none focus:border-purple-500"
                        >
                          <option value={20}>20%</option>
                          <option value={25}>25%</option>
                          <option value={30}>30% VIP</option>
                          <option value={35}>35% VIP</option>
                          <option value={40}>40% ELITE</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Affiliate Sales Table */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Historique des Ventes Liées aux Affiliés ({affiliateSales.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Attribution instantanée</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a101d] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Partenaire Rattaché</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Montant Vente</th>
                <th className="py-3 px-4">Commission Partenaire</th>
                <th className="py-3 px-4">Date &amp; Heure</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {affiliateSales.slice(0, 10).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {sale.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      {sale.affiliateCode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {sale.customerName || 'Acheteur Web'}
                  </td>
                  <td className="py-3 px-4 font-mono text-white">
                    {formatPrice(sale.orderTotal, sale.currency)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    +{formatPrice(sale.commissionAmount, sale.commissionCurrency)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(sale.timestamp).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Approuvé
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New VIP Partner */}
      {isNewPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1626] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </span>
                <h3 className="text-base font-bold text-white">Recruter un Partenaire VIP</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPartnerModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom complet / Nom de la chaîne
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Karim Tech DZ"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email du créateur
                </label>
                <input
                  type="email"
                  required
                  placeholder="karim.tech@gmail.com"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plateforme Principale
                  </label>
                  <select
                    value={newPartner.platform}
                    onChange={(e) => setNewPartner({ ...newPartner, platform: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram Reels</option>
                    <option value="telegram">Canal Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Site Web / Blog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Compte / Audience
                  </label>
                  <input
                    type="text"
                    placeholder="@compte (150K abonnés)"
                    value={newPartner.socialHandle}
                    onChange={(e) => setNewPartner({ ...newPartner, socialHandle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Méthode de Paiement
                  </label>
                  <select
                    value={newPartner.payoutMethod}
                    onChange={(e) => setNewPartner({ ...newPartner, payoutMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="baridimob">BaridiMob (Algérie 🇩🇿)</option>
                    <option value="ccp">Compte CCP (Algérie 🇩🇿)</option>
                    <option value="stc_pay">STC Pay (Golfe / KSA 🇸🇦)</option>
                    <option value="bank_transfer">Virement Bancaire (IBAN)</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">USDT / Crypto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Taux de Commission
                  </label>
                  <select
                    value={newPartner.customRate}
                    onChange={(e) => setNewPartner({ ...newPartner, customRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value={25}>25% (Standard)</option>
                    <option value={30}>30% (VIP Créateur)</option>
                    <option value={35}>35% (Exclusif)</option>
                    <option value={40}>40% (Élite)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coordonnées de virement / RIP / RIB
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: RIP BaridiMob : 00799999002345678912 ou IBAN / STC Pay"
                  value={newPartner.payoutDetails}
                  onChange={(e) => setNewPartner({ ...newPartner, payoutDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30"
                >
                  Générer le Partenaire VIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Validate Payout */}
      {payoutModalAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1626] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">Validation du Virement Partenaire</h3>
              </div>
              <button
                type="button"
                onClick={() => setPayoutModalAffiliate(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bénéficiaire :</span>
                  <span className="font-bold text-white">{payoutModalAffiliate.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Méthode :</span>
                  <span className="font-semibold text-cyan-300 capitalize">{payoutModalAffiliate.payoutMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordonnées :</span>
                  <span className="font-mono text-slate-200">{payoutModalAffiliate.payoutDetails}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="text-slate-300 font-bold">Montant à transférer :</span>
                  <span className="font-mono font-black text-emerald-400">
                    {formatPrice(payoutModalAffiliate.totalCommissionUsd - (payoutModalAffiliate.paidCommissionUsd || 0), 'USD')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Note ou Référence du Virement (Reçu / Transaction ID)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Virement BaridiMob TX-892182 ou PayPal ID"
                  value={payoutProofNote}
                  onChange={(e) => setPayoutProofNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPayoutModalAffiliate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayout}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                >
                  Marquer comme Payé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
