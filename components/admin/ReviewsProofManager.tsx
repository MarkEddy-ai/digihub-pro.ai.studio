'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { VerifiedReview } from '@/types';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Eye,
  MessageSquare,
  Globe,
  Award,
  Bell,
  Heart,
} from 'lucide-react';

export function ReviewsProofManager() {
  const {
    verifiedReviews,
    addVerifiedReview,
    deleteVerifiedReview,
    toggleReviewFeatured,
    products,
    showToast,
  } = useShop();

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [socialProofEnabled, setSocialProofEnabled] = useState(true);
  const [socialProofInterval, setSocialProofInterval] = useState(12);

  // Form for new review
  const [newReview, setNewReview] = useState<{
    authorName: string;
    productName: string;
    country: 'dz' | 'sa' | 'ae' | 'intl';
    countryLabel: string;
    flag: string;
    rating: number;
    comment: string;
    verifiedMethod: string;
    timeAgo: string;
    featured: boolean;
  }>({
    authorName: '',
    productName: 'Windows 11 Professionnel (Retail Permanente)',
    country: 'dz',
    countryLabel: 'Alger',
    flag: '🇩🇿',
    rating: 5,
    comment: '',
    verifiedMethod: 'Virement BaridiMob vérifié',
    timeAgo: 'Il y a quelques instants',
    featured: true,
  });

  const averageRating = 4.95;
  const totalReviews = verifiedReviews.length;
  const featuredCount = verifiedReviews.filter((r) => r.featured).length;

  const handleCountryChange = (c: 'dz' | 'sa' | 'ae' | 'intl') => {
    let flag = '🇩🇿';
    let label = 'Alger';
    let method = 'Virement BaridiMob vérifié';
    if (c === 'sa') {
      flag = '🇸🇦';
      label = 'الرياض';
      method = 'Apple Pay 🇸🇦 vérifié';
    } else if (c === 'ae') {
      flag = '🇦🇪';
      label = 'دبي';
      method = 'Carte Bancaire vérifiée';
    } else if (c === 'intl') {
      flag = '🌐';
      label = 'Paris, France';
      method = 'Stripe Checkout certifié';
    }
    setNewReview({
      ...newReview,
      country: c,
      flag,
      countryLabel: label,
      verifiedMethod: method,
    });
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName || !newReview.comment) {
      showToast('Veuillez renseigner le nom et le commentaire.', 'warning');
      return;
    }

    addVerifiedReview({
      authorName: newReview.authorName,
      productName: newReview.productName,
      country: newReview.country,
      countryLabel: newReview.countryLabel,
      flag: newReview.flag,
      rating: newReview.rating,
      comment: newReview.comment,
      verifiedMethod: newReview.verifiedMethod,
      timeAgo: newReview.timeAgo,
      featured: newReview.featured,
    });

    setIsAddReviewModalOpen(false);
    setNewReview({
      authorName: '',
      productName: 'Windows 11 Professionnel (Retail Permanente)',
      country: 'dz',
      countryLabel: 'Alger',
      flag: '🇩🇿',
      rating: 5,
      comment: '',
      verifiedMethod: 'Virement BaridiMob vérifié',
      timeAgo: 'Il y a quelques instants',
      featured: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              Avis Clients Certifiés &amp; Preuve Sociale
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              4.9/5 EXCELLENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gérez les témoignages d&apos;acheteurs réels (BaridiMob, Apple Pay, Stripe) et paramétrez le widget de notifications d&apos;achat en direct (Social Proof Popup).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddReviewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Importer un Avis Vérifié</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Note Moyenne */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Note Moyenne Globale</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-4 h-4 fill-amber-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">4.95</span>
            <span className="text-xs text-amber-400 font-bold">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-400 text-xs">
            {'★'.repeat(5)}
            <span className="text-slate-400 ml-1">99.4% satisfaction</span>
          </div>
        </div>

        {/* Card 2: Total Avis Reçus */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avis Vérifiés Publiés</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {totalReviews}
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% avec preuve d&apos;achat</span>
          </div>
        </div>

        {/* Card 3: Featured Reviews */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avis Mis en Avant</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Heart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">
            {featuredCount}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Visibles sur la page d&apos;accueil &amp; funnels</span>
          </div>
        </div>

        {/* Card 4: Social Proof Widget Status */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Widget Preuve Sociale</span>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bell className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${socialProofEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-lg font-bold text-white">
              {socialProofEnabled ? 'Actif sur Vitrine' : 'Désactivé'}
            </span>
          </div>
          <div className="mt-2 text-xs text-cyan-400">
            <span>Popup toutes les {socialProofInterval}s en bas à gauche</span>
          </div>
        </div>
      </div>

      {/* Social Proof Live Settings Panel */}
      <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Réglages du Widget Preuve Sociale (Live Popups)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Boost immédiat du taux de conversion (CRO)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Setting 1: Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Notifications d&apos;Achat en Direct</div>
              <div className="text-[11px] text-slate-400">Affiche les ventes récentes aux visiteurs</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSocialProofEnabled(!socialProofEnabled);
                showToast(
                  !socialProofEnabled
                    ? 'Preuve sociale activée sur la boutique !'
                    : 'Preuve sociale mise en pause.',
                  'info'
                );
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                socialProofEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Setting 2: Interval */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Fréquence d&apos;apparition</div>
              <div className="text-[11px] text-slate-400">Délai entre deux alertes acheteur</div>
            </div>
            <select
              value={socialProofInterval}
              onChange={(e) => {
                setSocialProofInterval(Number(e.target.value));
                showToast(`Intervalle configuré : toutes les ${e.target.value}s`, 'info');
              }}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value={8}>8 secondes (Dynamique)</option>
              <option value={12}>12 secondes (Recommandé)</option>
              <option value={20}>20 secondes (Discret)</option>
              <option value={35}>35 secondes</option>
            </select>
          </div>

          {/* Setting 3: Live Preview of Toast */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl shrink-0 border border-slate-700">
              🇩🇿
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-bold text-white truncate flex items-center gap-1">
                <span>Karim B. (Constantine)</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                A commandé Windows 11 Pro il y a 3 min
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Témoignages &amp; Avis Clients ({verifiedReviews.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Notes réelles d&apos;acheteurs vérifiés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a101d] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Client &amp; Origine</th>
                <th className="py-3.5 px-4">Note &amp; Étoiles</th>
                <th className="py-3.5 px-4">Produit Acheté</th>
                <th className="py-3.5 px-4">Témoignage / Commentaire</th>
                <th className="py-3.5 px-4">Preuve de Validation</th>
                <th className="py-3.5 px-4 text-center">Mis en Avant</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {verifiedReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Client & Origin */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rev.flag}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{rev.authorName}</div>
                        <div className="text-[11px] text-slate-400">{rev.countryLabel}</div>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      {'★'.repeat(rev.rating)}
                      <span className="text-[11px] text-slate-400 ml-1">({rev.rating}/5)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{rev.timeAgo}</div>
                  </td>

                  {/* Product */}
                  <td className="py-4 px-4 font-semibold text-slate-200 max-w-[200px]">
                    <div className="truncate" title={rev.productName}>
                      {rev.productName}
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="py-4 px-4 max-w-sm">
                    <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-2" title={rev.comment}>
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </td>

                  {/* Verification Badge */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{rev.verifiedMethod}</span>
                    </span>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleReviewFeatured(rev.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        rev.featured
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                      title={rev.featured ? 'Mis en avant (cliquer pour retirer)' : 'Mettre en avant'}
                    >
                      <Star className={`w-4 h-4 ${rev.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteVerifiedReview(rev.id)}
                      title="Supprimer l'avis"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Manual Review */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1626] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Star className="w-4 h-4 fill-amber-400" />
                </span>
                <h3 className="text-base font-bold text-white">Importer un Témoignage Certifié</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddReviewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Karim Benali"
                    value={newReview.authorName}
                    onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pays &amp; Marché
                  </label>
                  <select
                    value={newReview.country}
                    onChange={(e) => handleCountryChange(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="dz">🇩🇿 Algérie</option>
                    <option value="sa">🇸🇦 Arabie Saoudite</option>
                    <option value="ae">🇦🇪 Émirats Arabes Unis</option>
                    <option value="intl">🌐 International (Europe / US)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville / Région
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alger (Kouba) ou الرياض"
                    value={newReview.countryLabel}
                    onChange={(e) => setNewReview({ ...newReview, countryLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Note Attribuée
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer font-bold text-amber-400"
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Produit Concerné
                </label>
                <select
                  value={newReview.productName}
                  onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.title || p.name}>
                      {p.title || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Badge de Preuve &amp; Mode de Paiement
                </label>
                <input
                  type="text"
                  value={newReview.verifiedMethod}
                  onChange={(e) => setNewReview({ ...newReview, verifiedMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Commentaire / Message Client
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Clé reçue immédiatement par email, activation réussie sans problème !"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredReview"
                  checked={newReview.featured}
                  onChange={(e) => setNewReview({ ...newReview, featured: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="featuredReview" className="text-xs text-slate-300 cursor-pointer">
                  Mettre en avant sur la page d&apos;accueil et les tunnels
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25"
                >
                  Publier l&apos;Avis Certifié
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
