'use client';

import React, { useState, useId } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product, ProductOption, DeliveryType } from '@/types';
import { ProductImageMediaSelector } from './ProductImageMediaSelector';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Layers,
  KeyRound,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Percent,
  TrendingUp,
  Link as LinkIcon,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (product: Product) => void;
}

const DEFAULT_CATEGORIES = [
  'Logiciels & Systèmes',
  'Intelligence Artificielle & Outils',
  'Abonnements Numériques',
  'Jeux Vidéo & Clés CD',
  'Design & Création Graphique',
  'Sécurité & Antivirus',
  'Outils Développeur',
  'Templates & Thèmes Web',
  'E-books & Formations Digitales',
  '__custom__',
];

const PRESET_IMAGE_SUGGESTIONS = [
  { label: 'Windows / Système', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80' },
  { label: 'Intelligence Artificielle', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80' },
  { label: 'Design / Création', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sécurité & VPN', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
];

export function NewProductModal({ isOpen, onClose, onSuccess }: NewProductModalProps) {
  const { addProduct, addDigitalKeys, showToast } = useShop();

  // Form State - Section A: General & Marketing
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [descTab, setDescTab] = useState<'write' | 'preview'>('write');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [platform, setPlatform] = useState('Windows');

  // Form State - Section B: Pricing & Margins
  const [priceUsd, setPriceUsd] = useState<number>(29.99);
  const [costPriceUsd, setCostPriceUsd] = useState<number>(12.0);
  const [priceDzd, setPriceDzd] = useState<number>(4500);
  const [priceSar, setPriceSar] = useState<number>(115);
  const [hasPromo, setHasPromo] = useState<boolean>(false);
  const [compareAtPriceUsd, setCompareAtPriceUsd] = useState<number>(49.99);

  // Form State - Section C: Media
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form State - Section D: Variants / Tiers
  const [variants, setVariants] = useState<ProductOption[]>([
    { label: 'Licence Standard (1 Poste)', value: 'standard', priceDelta: 0, durationLabel: 'À vie' },
    { label: 'Licence Pro (3 Postes)', value: 'pro', priceDelta: 1500, durationLabel: 'À vie' },
    { label: 'Licence Entreprise (Illimitée)', value: 'enterprise', priceDelta: 4500, durationLabel: 'À vie' },
  ]);
  const [newVariantLabel, setNewVariantLabel] = useState('');
  const [newVariantDelta, setNewVariantDelta] = useState<number>(0);

  // Form State - Section E: Vault & Delivery
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('key');
  const [initialKeys, setInitialKeys] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const netMarginUsd = priceUsd - costPriceUsd;
  const marginPercentage = priceUsd > 0 ? Math.round((netMarginUsd / priceUsd) * 100) : 0;
  const discountSavingsPercent =
    hasPromo && compareAtPriceUsd > priceUsd
      ? Math.round(((compareAtPriceUsd - priceUsd) / compareAtPriceUsd) * 100)
      : 0;

  // Real-time automatic currency suggestions when USD changes
  const handleUsdChange = (val: number) => {
    setPriceUsd(val);
    setPriceDzd(Math.round(val * 150));
    setPriceSar(Math.round(val * 3.75));
    if (compareAtPriceUsd <= val) {
      setCompareAtPriceUsd(Math.round(val * 1.4));
    }
  };

  // Image Drag & Drop and local file handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readLocalImage(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readLocalImage(e.target.files[0]);
    }
  };

  const readLocalImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide (PNG, JPG, WebP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // AI Copywriting Generator via API route
  const handleGenerateAi = async () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Saisissez d&apos;abord le nom du produit pour l&apos;IA' }));
      return;
    }
    setIsGeneratingAi(true);
    try {
      const selectedCat = category === '__custom__' ? customCategory : category;
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: name,
          category: selectedCat,
        }),
      });

      if (!res.ok) throw new Error('Erreur de génération');
      const data = await res.json();
      if (data.text) {
        setDescription(data.text);
        if (!tagline) {
          setTagline(`Licence officielle certifiée ${name} • Activation immédiate 24/7`);
        }
        showToast('Argumentaire rédigé avec succès par l&apos;IA !', 'success');
      }
    } catch (err: any) {
      // Fallback
      setDescription(
        `### 🚀 ${name} — Solution Officielle & Clé Déverrouillée\n\nOptimisez vos performances avec une licence authentique à activation garantie en moins de 60 secondes.\n\n- ⚡ Livraison instantanée par email et coffre-fort\n- 🛡️ Clé 100% authentique constructeur sans expiration\n- 🔄 Mises à jour officielles incluses\n- 🤝 Support technique dédié 7j/7`
      );
      if (!tagline) {
        setTagline(`Licence officielle ${name} avec livraison instantanée`);
      }
      showToast('Modèle d&apos;argumentaire généré !', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Add custom variant
  const handleAddVariant = () => {
    if (!newVariantLabel.trim()) return;
    const newOption: ProductOption = {
      label: newVariantLabel.trim(),
      value: `var-${Date.now()}`,
      priceDelta: newVariantDelta,
      durationLabel: 'À vie',
    };
    setVariants([...variants, newOption]);
    setNewVariantLabel('');
    setNewVariantDelta(0);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = (isDraft = false) => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Le nom du produit est obligatoire.';
    if (priceUsd <= 0) newErrors.priceUsd = 'Le prix de vente doit être supérieur à 0.';
    if (category === '__custom__' && !customCategory.trim()) {
      newErrors.category = 'Précisez votre catégorie personnalisée.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Veuillez compléter les champs obligatoires en rouge', 'error');
      return;
    }

    const finalCategory = category === '__custom__' ? customCategory.trim() : category;
    const finalImage = imagePreview || imageUrl || 'https://picsum.photos/seed/product-software/800/600';

    const created = addProduct({
      title: name.trim(),
      name: name.trim(),
      tagline: tagline.trim() || `Licence certifiée ${name.trim()} avec livraison instantanée.`,
      shortDescription: tagline.trim(),
      fullDescription: description.trim() || `Description complète et caractéristiques techniques de ${name.trim()}.`,
      category: finalCategory,
      categoryLabel: finalCategory,
      platform,
      platforms: [platform as any],
      price_usd: Number(priceUsd),
      price_dzd: Number(priceDzd),
      price_sar: Number(priceSar),
      cost_price_usd: Number(costPriceUsd),
      price: Number(priceDzd),
      originalPrice: hasPromo ? Number(compareAtPriceUsd) * 150 : Math.round(Number(priceDzd) * 1.3),
      discountPercentage: discountSavingsPercent > 0 ? discountSavingsPercent : 0,
      image: finalImage,
      delivery_type: deliveryType,
      options: variants,
      inStock: initialKeys.trim().length > 0 || isDraft,
      stockCount: initialKeys.trim() ? initialKeys.split('\n').filter((k) => k.trim()).length : 0,
    });

    // If initial keys were supplied, inject them directly into the digital vault
    if (initialKeys.trim()) {
      addDigitalKeys(created.id, initialKeys);
    }

    showToast(
      isDraft
        ? `Produit "${name}" enregistré comme brouillon avec succès !`
        : `Produit "${name}" publié avec succès dans le catalogue !`,
      'success'
    );

    if (onSuccess) onSuccess(created);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in overflow-y-auto">
      <div className="bg-[#0e1626] border border-slate-700/80 rounded-3xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 font-sans">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Ajouter un Nouveau Produit
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60">
                  Shopify / Whop Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Créez une fiche e-commerce complète avec tarification multi-devises et clés sécurisées.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
          {/* SECTION A: Informations Générales & Contenu Marketing */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Section A — Informations Générales &amp; Contenu Marketing
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Étape 1 sur 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                  <span>Nom Officiel du Produit *</span>
                  {errors.name && <span className="text-rose-400 normal-case text-[11px]">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  placeholder="Ex: Windows 11 Professionnel Retail, ChatGPT Plus 1 Mois, Canva Pro..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full bg-[#0e1626] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    errors.name ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-700 focus:border-cyan-400 focus:ring-cyan-400/30'
                  }`}
                />
              </div>

              {/* Tagline / Catchphrase */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Accroche Commerciale / Tagline Persuasif
                </label>
                <input
                  type="text"
                  placeholder="Ex: Clé officielle Microsoft à vie • Activation instantanée en 30 secondes"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Catégorie du Produit
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === '__custom__' ? '✏️ Autre (Saisir manuellement...)' : cat}
                    </option>
                  ))}
                </select>

                {category === '__custom__' && (
                  <input
                    type="text"
                    placeholder="Saisissez la nouvelle catégorie..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full mt-2 bg-[#0e1626] border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs text-cyan-300 placeholder-slate-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Platform / Environment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Plateforme Cible
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Windows">Windows (PC)</option>
                  <option value="macOS">macOS (Apple)</option>
                  <option value="Web">Application Cloud / Web</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS (iPhone/iPad)</option>
                  <option value="Steam">Steam / Gaming</option>
                </select>
              </div>

              {/* Description with Markdown Editor / Preview and AI Button */}
              <div className="space-y-2 sm:col-span-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Description Détaillée &amp; Arguments de Vente
                  </label>

                  <div className="flex items-center gap-2">
                    {/* Write vs Preview Tabs */}
                    <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDescTab('write')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          descTab === 'write' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Edit3 className="w-3 h-3 inline mr-1" />
                        Éditeur
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescTab('preview')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          descTab === 'preview' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        Aperçu
                      </button>
                    </div>

                    {/* AI Copywriting Button */}
                    <button
                      type="button"
                      onClick={handleGenerateAi}
                      disabled={isGeneratingAi}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Générer automatiquement une description persuasive via Gemini AI"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAi ? 'Rédaction IA...' : 'Générer avec l\'IA'}</span>
                    </button>
                  </div>
                </div>

                {descTab === 'write' ? (
                  <textarea
                    rows={6}
                    placeholder="Détaillez les fonctionnalités, les conditions de validité, la compatibilité..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                  />
                ) : (
                  <div className="w-full min-h-[140px] bg-[#0e1626] border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {description ? description : <span className="text-slate-500 italic">Aucune description saisie pour le moment.</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION B: Tarification Multi-Devises & Promotions */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Section B — Tarification Multi-Devises &amp; Promotions
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Étape 2 sur 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* USD Base Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Prix de Vente de Base ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceUsd}
                    onChange={(e) => handleUsdChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Cost Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Coût de Revient ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPriceUsd}
                    onChange={(e) => setCostPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Net Margin Badge */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Marge Nette Estimée</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-emerald-400 font-mono">
                    +${netMarginUsd.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-emerald-300 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    {marginPercentage}%
                  </span>
                </div>
              </div>

              {/* Local Currencies: DZD and SAR */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Prix Algérie (DZD - BaridiMob)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-2.5 text-slate-500 font-mono text-xs">DA</span>
                  <input
                    type="number"
                    step="100"
                    value={priceDzd}
                    onChange={(e) => setPriceDzd(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Prix Golfe (SAR - mada / Apple Pay)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-2.5 text-slate-500 font-mono text-xs">SAR</span>
                  <input
                    type="number"
                    step="1"
                    value={priceSar}
                    onChange={(e) => setPriceSar(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl pl-3 pr-12 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <p className="text-[11px] text-slate-400 leading-tight">
                  💡 Les prix locaux sont convertis automatiquement d&apos;après le cours de change et restent modifiables manuellement.
                </p>
              </div>
            </div>

            {/* Discount / Promotion Switch */}
            <div className="pt-3 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-amber-400" />
                    Appliquer une Promotion / Prix Barré (Compare-at price)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Affiche le prix d&apos;origine barré et un badge d&apos;économie sur la vitrine client.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPromo}
                    onChange={(e) => setHasPromo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {hasPromo && (
                <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Prix d&apos;origine barré ($ USD) :
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={compareAtPriceUsd}
                      onChange={(e) => setCompareAtPriceUsd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Badge d&apos;économie :</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black font-mono w-max">
                      Économisez {discountSavingsPercent}%
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Prix Final Payé :</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      ${priceUsd.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION C: Médias & Visuels du Produit */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Section C — Médias &amp; Visuels du Produit
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Étape 3 sur 5</span>
            </div>

            <ProductImageMediaSelector
              value={imageUrl}
              onChange={(newUrl) => {
                setImageUrl(newUrl);
                setImagePreview(newUrl);
              }}
              badge={hasPromo ? `-${discountSavingsPercent}%` : 'Bestseller'}
              productTitle={name || 'Nouveau Produit'}
            />
          </div>

          {/* SECTION D: Modèles & Variantes (Licences / Versions) */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Section D — Modèles &amp; Variantes (Licences / Durées)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Étape 4 sur 5</span>
            </div>

            {/* List of current variants */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                Variantes configurées :
              </label>

              <div className="space-y-2">
                {variants.map((variant, idx) => (
                  <div
                    key={variant.value || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0e1626] border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white">{variant.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-300 font-bold">
                        {variant.priceDelta > 0 ? `+${variant.priceDelta} DA` : 'Inclus (Prix Base)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Supprimer la variante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add new variant tool */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                placeholder="Intitulé (ex: Pack Famille 5 Clés, 1 An de Support...)"
                value={newVariantLabel}
                onChange={(e) => setNewVariantLabel(e.target.value)}
                className="w-full sm:flex-1 bg-[#0e1626] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <div className="w-full sm:w-48 relative">
                <span className="absolute right-3 top-2 text-[10px] text-slate-500 font-mono">+DA</span>
                <input
                  type="number"
                  placeholder="Supplément prix"
                  value={newVariantDelta || ''}
                  onChange={(e) => setNewVariantDelta(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono pr-10 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                disabled={!newVariantLabel.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* SECTION E: Coffre-fort & Livraison Numérique */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Section E — Coffre-fort &amp; Livraison Numérique Immédiate
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Étape 5 sur 5</span>
            </div>

            <div className="space-y-4">
              {/* Delivery Type selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Mécanisme de Délivrance Automatisé :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('key')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'key'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">Clé de Licence CD-Key</span>
                      <span className="text-[10px] opacity-80">Déverrouillage par ligne de stock</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('account_text')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'account_text'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">Identifiants / Accès Web</span>
                      <span className="text-[10px] opacity-80">Format login:password ou invitation</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('manual_service')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'manual_service'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">Lien Sécurisé / Fichier</span>
                      <span className="text-[10px] opacity-80">URL Google Drive ou lien direct</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Initial Keys insertion */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    {deliveryType === 'key'
                      ? 'Insérer les premières clés en stock (1 par ligne) :'
                      : 'Données secrètes / Clé délivrée au client :'}
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    {initialKeys.trim() ? initialKeys.split('\n').filter((k) => k.trim()).length : 0} unité(s)
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder={`VK7JG-NPHTM-C97JM-9MPGT-3V66T\nW269N-WFGWX-YVC9B-4J6C9-T83GX\n...`}
                  value={initialKeys}
                  onChange={(e) => setInitialKeys(e.target.value)}
                  className="w-full bg-[#0e1626] border border-slate-700 rounded-xl p-3 text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-400">
                  🔒 Ces clés seront immédiatement enregistrées dans le coffre digital et délivrées automatiquement lors de chaque achat validé.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Enregistrer comme brouillon
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Publier le Produit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
