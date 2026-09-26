'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product, DeliveryType } from '@/types';
import { ProductImageMediaSelector } from './ProductImageMediaSelector';
import {
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calculator,
  X,
  Save,
  HelpCircle,
} from 'lucide-react';

interface ProductPricingManagerProps {
  onOpenNewProductModal?: () => void;
}

export function ProductPricingManager({ onOpenNewProductModal }: ProductPricingManagerProps = {}) {
  const { products, addProduct, updateProduct, deleteProduct, calculateProfitMetrics, showToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formValues, setFormValues] = useState<{
    title: string;
    platform: string;
    category: string;
    delivery_type: DeliveryType;
    cost_price_usd: number;
    price_dzd: number;
    price_sar: number;
    price_usd: number;
    image: string;
    tagline: string;
    badge?: string;
  }>({
    title: '',
    platform: 'Steam',
    category: 'Jeux',
    delivery_type: 'key',
    cost_price_usd: 15,
    price_dzd: 3500,
    price_sar: 85,
    price_usd: 25,
    image: 'https://picsum.photos/seed/digital-key/800/600',
    tagline: 'Clé officielle avec activation instantanée garantie.',
    badge: 'Bestseller',
  });

  // Calculate live preview metrics for the form
  const liveFormMetrics = useMemo(() => {
    const tempProd: Product = {
      id: 'temp',
      title: formValues.title,
      name: formValues.title,
      slug: 'temp',
      category: formValues.category,
      categoryLabel: formValues.category,
      platforms: [formValues.platform as any],
      cost_price_usd: Number(formValues.cost_price_usd) || 0,
      price_usd: Number(formValues.price_usd) || 0,
      price_dzd: Number(formValues.price_dzd) || 0,
      price_sar: Number(formValues.price_sar) || 0,
      price: Number(formValues.price_dzd) || 0,
      originalPrice: (Number(formValues.price_dzd) || 0) * 1.3,
      discountPercentage: 20,
      stockCount: 0,
      inStock: false,
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      image: '',
      productTypeLabel: 'Licence',
      deliveryTime: '',
      deliveryMethod: '',
      rating: 5,
      reviewCount: 1,
      features: [],
      whatIsIncluded: [],
      systemRequirements: { os: '' },
      activationGuide: [],
      faqs: [],
      reviews: [],
    };
    return calculateProfitMetrics(tempProd);
  }, [formValues, calculateProfitMetrics]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.platform?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormValues({
      title: '',
      platform: 'Steam',
      category: 'Jeux',
      delivery_type: 'key',
      cost_price_usd: 15,
      price_dzd: 3500,
      price_sar: 85,
      price_usd: 25,
      image: 'https://picsum.photos/seed/game-cover/800/600',
      tagline: 'Clé authentique garantie avec livraison immédiate.',
      badge: 'Bestseller',
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setFormValues({
      title: p.title || p.name,
      platform: p.platform || (p.platforms && p.platforms[0]) || 'Steam',
      category: p.category || 'Jeux',
      delivery_type: p.delivery_type || 'key',
      cost_price_usd: p.cost_price_usd || 10,
      price_dzd: p.price_dzd || p.price || 2500,
      price_sar: p.price_sar || Math.round((p.price_dzd || p.price || 2500) * 0.027),
      price_usd: p.price_usd || Math.round((p.price_dzd || p.price || 2500) / 140),
      image: p.image || 'https://picsum.photos/seed/game-cover/800/600',
      tagline: p.tagline || '',
      badge: p.badge,
    });
    setIsModalOpen(true);
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title.trim()) {
      showToast('Veuillez renseigner le titre du produit.', 'error');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: formValues.title,
        name: formValues.title,
        platform: formValues.platform,
        category: formValues.category,
        delivery_type: formValues.delivery_type,
        cost_price_usd: Number(formValues.cost_price_usd),
        price_dzd: Number(formValues.price_dzd),
        price_sar: Number(formValues.price_sar),
        price_usd: Number(formValues.price_usd),
        price: Number(formValues.price_dzd),
        image: formValues.image,
        tagline: formValues.tagline,
        badge: formValues.badge as any,
      });
      showToast('Produit et tarification mis à jour avec succès !', 'success');
    } else {
      addProduct({
        title: formValues.title,
        name: formValues.title,
        platform: formValues.platform,
        category: formValues.category,
        delivery_type: formValues.delivery_type,
        cost_price_usd: Number(formValues.cost_price_usd),
        price_dzd: Number(formValues.price_dzd),
        price_sar: Number(formValues.price_sar),
        price_usd: Number(formValues.price_usd),
        price: Number(formValues.price_dzd),
        image: formValues.image,
        tagline: formValues.tagline,
        badge: formValues.badge as any,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-wide">
              Gestion Multi-Devises &amp; Calculateur de Marges
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configurez vos prix de vente (DZD, SAR, USD) en fonction de vos coûts d&apos;achat sources (Plati.market, GGsel, FunPay).
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewProductModal || handleOpenCreate}
          className="px-4 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Nouveau Produit</span>
        </button>
      </div>

      {/* Exchange Rate Reference Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Taux Référence Algérie (Marché Square / Import) :</span>
          <span className="font-mono font-bold text-white">1 USD ≈ 220 DZD</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Taux Arabie Saoudite (SAR) :</span>
          <span className="font-mono font-bold text-white">1 USD ≈ 3.75 SAR</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Sources d&apos;approvisionnement :</span>
          <span className="font-bold text-emerald-300">Plati.market • GGsel • FunPay</span>
        </div>
      </div>

      {/* Products Table with multi-currency and margins */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Catalogue &amp; Rentabilité en Direct ({filteredProducts.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par titre ou plateforme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Produit &amp; Plateforme</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Coût Source (USD)</th>
                <th className="py-3 px-3">Prix DZD (DA)</th>
                <th className="py-3 px-3">Prix SAR</th>
                <th className="py-3 px-3">Prix USD ($)</th>
                <th className="py-3 px-3">Marge Estimée (USD)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const metrics = calculateProfitMetrics(p);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.image}
                          alt={p.title || p.name}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-800 border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-xs leading-snug">{p.title || p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300">
                              {p.platform || 'Digital'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Livraison : {p.delivery_type || 'key'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-[11px] border border-slate-800">
                        {p.category}
                      </span>
                    </td>

                    {/* Cost USD */}
                    <td className="py-3 px-3 font-mono font-semibold text-rose-300">
                      ${p.cost_price_usd ?? 0}
                    </td>

                    {/* Price DZD */}
                    <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                      {(p.price_dzd || p.price || 0).toLocaleString('fr-FR')} DA
                    </td>

                    {/* Price SAR */}
                    <td className="py-3 px-3 font-mono text-slate-200">
                      {(p.price_sar || 0).toLocaleString('fr-FR')} SAR
                    </td>

                    {/* Price USD */}
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                      ${p.price_usd || 0}
                    </td>

                    {/* Margin USD & indicator */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold ${
                            metrics.marginUsd > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {metrics.marginUsd > 0 ? `+$${metrics.marginUsd}` : `$${metrics.marginUsd}`}
                        </span>

                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            metrics.marginPercentUsd >= 30
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : metrics.marginPercentUsd > 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {metrics.marginPercentUsd}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Est. DA : {metrics.marginDzdEstimated > 0 ? `+${metrics.marginDzdEstimated.toLocaleString('fr-FR')} DA` : `${metrics.marginDzdEstimated.toLocaleString('fr-FR')} DA`}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                          title="Modifier les prix et informations"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement le produit "${p.title || p.name}" ?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Supprimer le produit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingProductId ? 'Modifier les Tarifs & Détails Produit' : 'Nouveau Produit & Tarification Multi-Devises'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titre du Produit (Nom du jeu ou service) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Black Myth: Wukong - Clé Steam Global"
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Platform, Category, Delivery Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plateforme *
                  </label>
                  <select
                    value={formValues.platform}
                    onChange={(e) => setFormValues({ ...formValues, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Steam">Steam</option>
                    <option value="Epic">Epic Games</option>
                    <option value="PSN">PlayStation Network (PSN)</option>
                    <option value="Xbox">Xbox / Microsoft</option>
                    <option value="Office">Office / Windows</option>
                    <option value="OpenAI">OpenAI / ChatGPT</option>
                    <option value="Android">Android / Google</option>
                    <option value="iOS">Apple / iOS</option>
                    <option value="Web">Web / SaaS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formValues.category}
                    onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Jeux">Jeux (Clés CD)</option>
                    <option value="Abonnements">Abonnements</option>
                    <option value="Logiciels">Logiciels</option>
                    <option value="Monnaie virtuelle">Monnaie virtuelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type de Livraison *
                  </label>
                  <select
                    value={formValues.delivery_type}
                    onChange={(e) => setFormValues({ ...formValues, delivery_type: e.target.value as DeliveryType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="key">Clé CD (key)</option>
                    <option value="account_text">Compte login:password (account_text)</option>
                    <option value="manual_service">Service manuel / ID (manual_service)</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Cost Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Structure des Coûts &amp; Prix de Vente
                  </h4>
                  <span className="text-[10px] text-slate-400">Calcul en temps réel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Cost Price USD */}
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-300 mb-1">
                      Coût Source (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formValues.cost_price_usd}
                        onChange={(e) => setFormValues({ ...formValues, cost_price_usd: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-400"
                        placeholder="Ex : 12.50"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Plati / GGsel</span>
                  </div>

                  {/* Price DZD */}
                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-300 mb-1">
                      Prix Vente DZD (DA) *
                    </label>
                    <input
                      type="number"
                      step="50"
                      required
                      value={formValues.price_dzd}
                      onChange={(e) => setFormValues({ ...formValues, price_dzd: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      placeholder="Ex : 3500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Client Algérie</span>
                  </div>

                  {/* Price SAR */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Prix Vente SAR *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formValues.price_sar}
                      onChange={(e) => setFormValues({ ...formValues, price_sar: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-400"
                      placeholder="Ex : 85"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Arabie Saoudite</span>
                  </div>

                  {/* Price USD */}
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-300 mb-1">
                      Prix Vente USD ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={formValues.price_usd}
                        onChange={(e) => setFormValues({ ...formValues, price_usd: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                        placeholder="Ex : 25"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">International</span>
                  </div>
                </div>

                {/* Live Profit Preview Box */}
                <div className={`mt-3 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  liveFormMetrics.isProfitHealthy
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : liveFormMetrics.marginUsd > 0
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wide">
                        {liveFormMetrics.isProfitHealthy ? 'Excellente Marge Bénéficiaire' : 'Rentabilité Modérée ou Faible'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900">
                        {liveFormMetrics.marginPercentUsd}% de marge USD
                      </span>
                    </div>
                    <p className="text-[11px] mt-0.5 text-slate-300">
                      Bénéfice net USD : <strong>+${liveFormMetrics.marginUsd}</strong> par vente • Bénéfice estimé Algérie : <strong>+{liveFormMetrics.marginDzdEstimated.toLocaleString('fr-FR')} DA</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white block">
                      {liveFormMetrics.marginUsd > 0 ? `+${liveFormMetrics.marginPercentUsd}%` : `${liveFormMetrics.marginPercentUsd}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Affiché sur la Miniature
                  </label>
                  <select
                    value={formValues.badge || 'Bestseller'}
                    onChange={(e) => setFormValues({ ...formValues, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="Nouveauté">Nouveauté</option>
                    <option value="Offre Flash">Offre Flash</option>
                    <option value="Populaire">Populaire</option>
                    <option value="Stock Limité">Stock Limité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline / Description courte
                  </label>
                  <input
                    type="text"
                    value={formValues.tagline}
                    onChange={(e) => setFormValues({ ...formValues, tagline: e.target.value })}
                    placeholder="Ex : Activation immédiate sur Steam, aucun VPN requis."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Professional Media & Image Selector (Upload + Unsplash/Pexels) */}
              <div className="pt-2 border-t border-slate-800">
                <ProductImageMediaSelector
                  value={formValues.image}
                  onChange={(newUrl) => setFormValues({ ...formValues, image: newUrl })}
                  badge={formValues.badge || 'Bestseller'}
                  productTitle={formValues.title || 'Produit'}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProductId ? 'Sauvegarder les modifications' : 'Créer le produit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
