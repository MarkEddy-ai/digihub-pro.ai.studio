'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FUNNEL_PRODUCTS,
  FUNNEL_ORDER_BUMP,
  FUNNEL_UPSELL_OFFER,
  FUNNEL_RETENTION_SETTINGS,
  FunnelProductOffer,
  FunnelOrderBumpOffer,
  FunnelUpsellOffer,
  FunnelRetentionSettings,
} from '@/data/funnelOffers';
import { useShop } from '@/context/ShopContext';
import { ProductLandingEditorModal } from './ProductLandingEditorModal';
import {
  Flame,
  Zap,
  TrendingUp,
  Percent,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Copy,
  Check,
  Eye,
  Plus,
  BarChart3,
  Edit3,
  Trash2,
  Sliders,
  Smartphone,
  Palette,
  Timer,
  ShoppingBag,
  DollarSign,
  Tag,
  Gift,
  HelpCircle,
  MessageSquare,
  Lock,
  Save,
  Clock,
  RefreshCw,
} from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'novalys_funnel_products_v2';
const STORAGE_KEY_BUMP = 'novalys_order_bump_v2';
const STORAGE_KEY_UPSELL = 'novalys_upsell_v2';
const STORAGE_KEY_RETENTION = 'novalys_retention_v2';

type FunnelStepTab = 'step1_landing' | 'step2_bump' | 'step3_upsell' | 'step4_delivery';

export function FunnelsManager() {
  const { showToast } = useShop();

  // Active Top Step Tab
  const [activeTab, setActiveTab] = useState<FunnelStepTab>('step1_landing');

  // Copy status
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 12 Dynamic Products State
  const [products, setProducts] = useState<FunnelProductOffer[]>(() => {
    if (typeof window === 'undefined') return FUNNEL_PRODUCTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products', e);
    }
    return FUNNEL_PRODUCTS;
  });

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FunnelProductOffer | null>(null);

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'tiktok' | 'meta' | 'google'>('all');

  // Order Bump VIP Settings State
  const [bumpSettings, setBumpSettings] = useState<FunnelOrderBumpOffer>(() => {
    if (typeof window === 'undefined') return FUNNEL_ORDER_BUMP;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BUMP);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return FUNNEL_ORDER_BUMP;
  });

  // Upsell Settings State
  const [upsellSettings, setUpsellSettings] = useState<FunnelUpsellOffer>(() => {
    if (typeof window === 'undefined') return FUNNEL_UPSELL_OFFER;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_UPSELL);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return FUNNEL_UPSELL_OFFER;
  });

  // Delivery & Retention Settings State
  const [retentionSettings, setRetentionSettings] = useState<FunnelRetentionSettings>(() => {
    if (typeof window === 'undefined') return FUNNEL_RETENTION_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RETENTION);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return FUNNEL_RETENTION_SETTINGS;
  });

  // Persistence helpers
  const saveProductsToStorage = (updated: FunnelProductOffer[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = (updated: FunnelProductOffer) => {
    const idx = products.findIndex((p) => p.id === updated.id);
    let newList: FunnelProductOffer[];
    if (idx >= 0) {
      newList = [...products];
      newList[idx] = updated;
    } else {
      newList = [updated, ...products];
    }
    saveProductsToStorage(newList);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsToStorage(updated);
    showToast('Produit retiré du catalogue.', 'info');
  };

  const handleResetCatalog = () => {
    if (confirm('Voulez-vous réinitialiser le catalogue avec les 12 produits officiels de référence ?')) {
      saveProductsToStorage(FUNNEL_PRODUCTS);
      showToast('Catalogue réinitialisé avec les 12 produits d\'usine.', 'success');
    }
  };

  // Copy helper for Regional URLs & Landing Pages
  const copyToClipboard = (text: string, identifier: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    showToast(`Lien ${label} copié dans le presse-papier !`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getOrigin = () => {
    return typeof window !== 'undefined' ? window.location.origin : '';
  };

  // Filtered products list
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      prod.slug.toLowerCase().includes(searchFilter.toLowerCase()) ||
      prod.badge.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesSource =
      sourceFilter === 'all' || (prod.trafficSource || 'tiktok') === sourceFilter;

    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1626] p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Moteur de Funnels &amp; Landing Pages CRO
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Pilotez vos entonnoirs publicitaires Meta &amp; TikTok : pages mono-produit, Order Bump VIP, Upsell One-Click et livraison instantanée.
          </p>
        </div>

        {/* Global Funnels Performance Badge & Add Product */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Taux d&apos;acceptation Bump :</span>
              <strong className="text-amber-400 font-mono text-sm font-bold">38.4%</strong>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">Acceptation Upsell :</span>
              <strong className="text-emerald-400 font-mono text-sm font-bold">29.1%</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsEditorOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* 4 INTERACTIVE STEP TABS (Clickable & Reactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* TAB 1: Landing Mono-Produit */}
        <button
          type="button"
          onClick={() => setActiveTab('step1_landing')}
          className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden group ${
            activeTab === 'step1_landing'
              ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          {activeTab === 'step1_landing' && (
            <div className="absolute top-0 right-0 w-2 h-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                  activeTab === 'step1_landing'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                1
              </span>
              <span className="font-bold text-white text-sm">Landing Mono-Produit</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {products.length} Produits
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Éditeur de Landing Pages, puces bénéfices, tarifs multi-devises et liens d&apos;acquisition.
          </p>
          <div className="mt-2 text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
            <span>{activeTab === 'step1_landing' ? '● Actif en vue' : 'Cliquer pour gérer les produits'}</span>
          </div>
        </button>

        {/* TAB 2: Order Bump VIP */}
        <button
          type="button"
          onClick={() => setActiveTab('step2_bump')}
          className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden group ${
            activeTab === 'step2_bump'
              ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          {activeTab === 'step2_bump' && (
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                  activeTab === 'step2_bump'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                2
              </span>
              <span className="font-bold text-amber-300 text-sm">Order Bump VIP</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                bumpSettings.enabled !== false
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {bumpSettings.enabled !== false ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Micro-vente additionnelle (+290 DA / $1.99) avant le paiement pour booster le panier moyen.
          </p>
          <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
            <span>{activeTab === 'step2_bump' ? '● Actif en vue' : 'Cliquer pour configurer le Bump'}</span>
          </div>
        </button>

        {/* TAB 3: One-Click Upsell */}
        <button
          type="button"
          onClick={() => setActiveTab('step3_upsell')}
          className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden group ${
            activeTab === 'step3_upsell'
              ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400'
              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          {activeTab === 'step3_upsell' && (
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400 shadow-[0_0_12px_#10b981]" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                  activeTab === 'step3_upsell'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                3
              </span>
              <span className="font-bold text-emerald-300 text-sm">One-Click Upsell</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                upsellSettings.enabled !== false
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {upsellSettings.enabled !== false ? '-70% PROMO' : 'DÉSACTIVÉ'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Offre post-achat immédiate (Pack Office à -70%) avec décompte d&apos;urgence 5 minutes.
          </p>
          <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>{activeTab === 'step3_upsell' ? '● Actif en vue' : 'Cliquer pour configurer l\'Upsell'}</span>
          </div>
        </button>

        {/* TAB 4: Livraison & Rétention */}
        <button
          type="button"
          onClick={() => setActiveTab('step4_delivery')}
          className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden group ${
            activeTab === 'step4_delivery'
              ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          {activeTab === 'step4_delivery' && (
            <div className="absolute top-0 right-0 w-2 h-full bg-purple-400 shadow-[0_0_12px_#c084fc]" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                  activeTab === 'step4_delivery'
                    ? 'bg-purple-500 text-slate-950 font-black'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                4
              </span>
              <span className="font-bold text-purple-300 text-sm">Livraison &amp; Rétention</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              {retentionSettings.couponCode} (-{retentionSettings.couponDiscountPercent}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Délivrance de licence, guide pas-à-pas et code promo de réachat sur la boutique.
          </p>
          <div className="mt-2 text-[10px] text-purple-400 font-semibold flex items-center gap-1">
            <span>{activeTab === 'step4_delivery' ? '● Actif en vue' : 'Cliquer pour configurer'}</span>
          </div>
        </button>
      </div>

      {/* VIEW 1: LANDING MONO-PRODUIT (12 PRODUCTS CATALOG & LANDING PAGES) */}
      {activeTab === 'step1_landing' && (
        <div className="bg-[#0e1626] rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
          {/* Controls Bar: Search, Traffic filter & Reset */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  Catalogue des Landing Pages ({filteredProducts.length} / {products.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Chaque produit dispose de sa propre Landing Page modifiable avec puces bénéfices et prix multi-devises.
                </p>
              </div>
            </div>

            {/* Filter pills & search */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer un produit..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSourceFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    sourceFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter('tiktok')}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    sourceFilter === 'tiktok' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  TikTok
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter('meta')}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    sourceFilter === 'meta' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Meta
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter('google')}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    sourceFilter === 'google' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetCatalog}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
                title="Réinitialiser les 12 produits officiels"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 12 Products List Cards */}
          <div className="space-y-4">
            {filteredProducts.map((prod, index) => {
              const origin = getOrigin();
              const landingUrl = `${origin}/p/${prod.slug}`;
              const linkDz = `${origin}/p/${prod.slug}?country=dz`;
              const linkSa = `${origin}/p/${prod.slug}?country=sa`;
              const linkGlobal = `${origin}/p/${prod.slug}?country=global`;

              const netProfit = Math.max(0, prod.priceUsd - (prod.costPriceUsd || 2.5));
              const marginPercent = Math.round((netProfit / (prod.priceUsd || 1)) * 100);

              return (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-5"
                >
                  {/* Left: Product Media, Title, Bullets & Prices */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-18 h-18 rounded-2xl object-cover border border-slate-800 shadow-md"
                      />
                      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">{prod.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          {prod.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                          /p/{prod.slug}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                          {prod.trafficSource || 'tiktok'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{prod.subtitle}</p>

                      {/* Bullets Preview */}
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 pt-0.5">
                        {prod.highlights?.slice(0, 2).map((h, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-slate-400">
                            <span className="text-emerald-400">✓</span> {h}
                          </span>
                        ))}
                      </div>

                      {/* Prices & Margins */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-300">
                        <span className="text-emerald-400 font-bold">🇩🇿 {prod.priceDzd} DA</span>
                        <span className="text-cyan-300 font-bold">🇸🇦 {prod.priceSar} SAR</span>
                        <span className="text-white font-bold">🌐 ${prod.priceUsd}</span>
                        <span className="text-slate-500 text-[11px]">Coût: ${prod.costPriceUsd || 2.5}</span>
                        <span className="text-amber-400 font-sans text-[11px] font-bold">
                          Marge: {marginPercent}% (+${netProfit.toFixed(2)})
                        </span>
                        <span className="text-slate-400 font-sans text-[11px]">
                          Stock restant : <strong className="text-white">{prod.stockRemaining}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions, Regional Copy Links & Test Funnel */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    {/* Copy Main Landing URL */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(landingUrl, `${prod.id}-main`, 'Landing Page')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 transition-all"
                      title="Copier le lien direct de la Landing Page (/p/[slug])"
                    >
                      {copiedKey === `${prod.id}-main` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>Copier Lien</span>
                    </button>

                    {/* Regional Copy: DZ */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(linkDz, `${prod.id}-dz`, 'DZ (Meta/TikTok Ads)')}
                      className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1 transition-all"
                      title="Copier URL pour l'Algérie (?country=dz)"
                    >
                      {copiedKey === `${prod.id}-dz` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>🇩🇿 Lien DZ</span>
                      )}
                    </button>

                    {/* Regional Copy: SA */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(linkSa, `${prod.id}-sa`, 'SA (Arabie Saoudite)')}
                      className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1 transition-all"
                      title="Copier URL pour l'Arabie Saoudite (?country=sa)"
                    >
                      {copiedKey === `${prod.id}-sa` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>🇸🇦 Lien SA</span>
                      )}
                    </button>

                    {/* Regional Copy: Global */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(linkGlobal, `${prod.id}-global`, 'Global (USD)')}
                      className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1 transition-all"
                      title="Copier URL internationale (?country=global)"
                    >
                      {copiedKey === `${prod.id}-global` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>🌐 Global</span>
                      )}
                    </button>

                    {/* Edit Landing Page / Copywriting Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsEditorOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      title="Modifier les puces, les prix et le copywriting"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Modifier</span>
                    </button>

                    {/* Test Funnel Live */}
                    <Link
                      href={`/p/${prod.slug}?country=dz`}
                      target="_blank"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tester le Funnel</span>
                    </Link>

                    {/* Delete Product */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Supprimer le produit "${prod.title}" ?`)) {
                          handleDeleteProduct(prod.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ORDER BUMP VIP CONFIGURATION */}
      {activeTab === 'step2_bump' && (
        <div className="bg-[#0e1626] rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="w-5 h-5 fill-current" />
                </span>
                <h2 className="text-lg font-black text-white">Configuration de l&apos;Order Bump VIP</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                L&apos;Order Bump est proposé sous forme de case à cocher sur la page de paiement avant validation.
              </p>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Statut du Bump :</span>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...bumpSettings, enabled: !(bumpSettings.enabled !== false) };
                  setBumpSettings(updated);
                  localStorage.setItem(STORAGE_KEY_BUMP, JSON.stringify(updated));
                  showToast(
                    updated.enabled ? 'Order Bump VIP activé !' : 'Order Bump VIP désactivé.',
                    updated.enabled ? 'success' : 'info'
                  );
                }}
                className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                  bumpSettings.enabled !== false
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {bumpSettings.enabled !== false ? '✓ ACTIVÉ' : '✕ DÉSACTIVÉ'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Multilingual Text Configuration */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  🇩🇿 Version Algérie (Français &amp; Darija)
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Titre du Bump</label>
                  <input
                    type="text"
                    value={bumpSettings.title.dz}
                    onChange={(e) =>
                      setBumpSettings({
                        ...bumpSettings,
                        title: { ...bumpSettings.title, dz: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Description Persuasive</label>
                  <textarea
                    rows={2}
                    value={bumpSettings.description.dz}
                    onChange={(e) =>
                      setBumpSettings({
                        ...bumpSettings,
                        description: { ...bumpSettings.description, dz: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  🇸🇦 Version Arabie Saoudite &amp; Golfe (Arabe)
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">عنوان العرض الإضافي</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={bumpSettings.title.sa}
                    onChange={(e) =>
                      setBumpSettings({
                        ...bumpSettings,
                        title: { ...bumpSettings.title, sa: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">الوصف المقنع</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={bumpSettings.description.sa}
                    onChange={(e) =>
                      setBumpSettings({
                        ...bumpSettings,
                        description: { ...bumpSettings.description, sa: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Right: Pricing & Live Checkout Preview */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Tarifs Multi-Devises du Bump
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Prix DZD (Algérie)</label>
                    <input
                      type="number"
                      value={bumpSettings.priceDzd}
                      onChange={(e) =>
                        setBumpSettings({ ...bumpSettings, priceDzd: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Prix SAR (Golfe)</label>
                    <input
                      type="number"
                      value={bumpSettings.priceSar}
                      onChange={(e) =>
                        setBumpSettings({ ...bumpSettings, priceSar: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-cyan-300 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Prix USD ($ Ref)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={bumpSettings.priceUsd}
                      onChange={(e) =>
                        setBumpSettings({ ...bumpSettings, priceUsd: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border-2 border-dashed border-amber-500/40 space-y-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Aperçu en Direct sur la Page de Commande
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/50 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 mt-0.5 rounded accent-amber-400"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{bumpSettings.title.dz}</span>
                      <span className="text-xs font-black text-amber-400 font-mono">
                        +{bumpSettings.priceDzd} DA
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{bumpSettings.description.dz}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY_BUMP, JSON.stringify(bumpSettings));
                  showToast('Réglages de l\'Order Bump enregistrés !', 'success');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Configuration Order Bump</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ONE-CLICK UPSELL CONFIGURATION */}
      {activeTab === 'step3_upsell' && (
        <div className="bg-[#0e1626] rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-black text-white">Configuration de l&apos;Upsell Post-Achat (-70%)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                L&apos;offre s&apos;affiche immédiatement après la validation de la commande principale avec un décompte d&apos;urgence.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Statut de l&apos;Upsell :</span>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...upsellSettings, enabled: !(upsellSettings.enabled !== false) };
                  setUpsellSettings(updated);
                  localStorage.setItem(STORAGE_KEY_UPSELL, JSON.stringify(updated));
                  showToast(
                    updated.enabled ? 'One-Click Upsell activé !' : 'One-Click Upsell désactivé.',
                    updated.enabled ? 'success' : 'info'
                  );
                }}
                className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                  upsellSettings.enabled !== false
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {upsellSettings.enabled !== false ? '✓ ACTIVÉ' : '✕ DÉSACTIVÉ'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Upsell Texts & Pricing */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Accroche &amp; Description de l&apos;Offre VIP
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Titre de l&apos;Upsell</label>
                  <input
                    type="text"
                    value={upsellSettings.title.dz}
                    onChange={(e) =>
                      setUpsellSettings({
                        ...upsellSettings,
                        title: { ...upsellSettings.title, dz: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Accroche d&apos;Urgence</label>
                  <input
                    type="text"
                    value={upsellSettings.headline.dz}
                    onChange={(e) =>
                      setUpsellSettings({
                        ...upsellSettings,
                        headline: { ...upsellSettings.headline, dz: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Prix DZD</label>
                    <input
                      type="number"
                      value={upsellSettings.priceDzd}
                      onChange={(e) =>
                        setUpsellSettings({ ...upsellSettings, priceDzd: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Prix SAR</label>
                    <input
                      type="number"
                      value={upsellSettings.priceSar}
                      onChange={(e) =>
                        setUpsellSettings({ ...upsellSettings, priceSar: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-cyan-300 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Minuteur (Min)</label>
                    <input
                      type="number"
                      value={upsellSettings.urgencyMinutes || 5}
                      onChange={(e) =>
                        setUpsellSettings({
                          ...upsellSettings,
                          urgencyMinutes: parseInt(e.target.value) || 5,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-xs text-rose-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY_UPSELL, JSON.stringify(upsellSettings));
                  showToast('Réglages de l\'Upsell enregistrés !', 'success');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Configuration Upsell</span>
              </button>
            </div>

            {/* Right: Upsell Visual Preview */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Aperçu Visuel de l&apos;Upsell Post-Achat
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-500/30">
                  Décompte 04:59
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    {upsellSettings.headline.dz}
                  </span>
                  <h4 className="text-sm font-black text-white">{upsellSettings.title.dz}</h4>
                </div>

                <div className="flex items-center justify-center gap-3 py-1 font-mono">
                  <span className="text-slate-500 line-through text-xs">$149.00</span>
                  <span className="text-base font-black text-emerald-400">{upsellSettings.priceDzd} DA</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    -{upsellSettings.discountPercentage}%
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  {upsellSettings.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> {f}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs text-center shadow-md"
                  >
                    OUI, AJOUTER À MA COMMANDE IMMÉDIATEMENT (-70%)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: LIVRAISON & RÉTENTION */}
      {activeTab === 'step4_delivery' && (
        <div className="bg-[#0e1626] rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Gift className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-white">Livraison Instantanée &amp; Fidélisation Client</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configurez le code promo de fidélisation (-20%) et les canaux d&apos;assistance prioritaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Code Promo de Fidélisation Boutique
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Code Promo</label>
                  <input
                    type="text"
                    value={retentionSettings.couponCode}
                    onChange={(e) =>
                      setRetentionSettings({ ...retentionSettings, couponCode: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono text-sm font-black text-purple-300 uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">Remise (%)</label>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      value={retentionSettings.couponDiscountPercent}
                      onChange={(e) =>
                        setRetentionSettings({
                          ...retentionSettings,
                          couponDiscountPercent: parseInt(e.target.value) || 20,
                        })
                      }
                      className="w-full bg-transparent font-mono text-sm font-bold text-white focus:outline-none"
                    />
                    <span className="text-slate-500 font-mono">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold">Message de Remerciement</label>
                <textarea
                  rows={3}
                  value={retentionSettings.thankYouMessage}
                  onChange={(e) =>
                    setRetentionSettings({ ...retentionSettings, thankYouMessage: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Support Dédié &amp; Livraison
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold">Numéro WhatsApp Support</label>
                <input
                  type="text"
                  value={retentionSettings.whatsappSupportNumber}
                  onChange={(e) =>
                    setRetentionSettings({ ...retentionSettings, whatsappSupportNumber: e.target.value })
                  }
                  placeholder="+213 550..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold">Email Assistance</label>
                <input
                  type="email"
                  value={retentionSettings.emailSupport}
                  onChange={(e) =>
                    setRetentionSettings({ ...retentionSettings, emailSupport: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY_RETENTION, JSON.stringify(retentionSettings));
                    showToast('Paramètres de livraison et rétention enregistrés !', 'success');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Paramètres de Rétention</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Landing Editor Modal */}
      {isEditorOpen && (
        <ProductLandingEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          product={editingProduct}
          onSave={handleSaveProduct}
          onDelete={editingProduct ? handleDeleteProduct : undefined}
        />
      )}
    </div>
  );
}
