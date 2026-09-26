'use client';

import React, { useState } from 'react';
import {
  CustomFunnelConfig,
  FunnelArchitecture,
  FunnelThemePalette,
  FunnelBackgroundPattern,
  FunnelTargetRegion,
  FunnelAdPlatform,
} from '@/types';
import { useShop } from '@/context/ShopContext';
import { HighConversionFunnelView } from '@/components/funnel/HighConversionFunnelView';
import {
  X,
  Sparkles,
  Layers,
  Palette,
  Globe2,
  Share2,
  Eye,
  Edit3,
  CheckCircle2,
  Smartphone,
  Monitor,
  Flame,
  Zap,
  Tag,
  Plus,
  Trash2,
  DollarSign,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface FunnelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (funnel: CustomFunnelConfig) => void;
  initialFunnel?: CustomFunnelConfig | null;
}

export function FunnelBuilderModal({
  isOpen,
  onClose,
  onSave,
  initialFunnel,
}: FunnelBuilderModalProps) {
  const { products, showToast } = useShop();

  // Active Tab: Editor vs Live Preview
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Stable ID and creation timestamp
  const [funnelId] = useState(
    () => initialFunnel?.id || `funnel-${Math.random().toString(36).substring(2, 9)}`
  );
  const [createdAt] = useState(() => initialFunnel?.createdAt || new Date().toISOString());

  // Form State
  const [title, setTitle] = useState(initialFunnel?.title || '');
  const [slug, setSlug] = useState(initialFunnel?.slug || '');
  const [productId, setProductId] = useState(initialFunnel?.productId || (products[0]?.id || ''));
  const [hookHeadline, setHookHeadline] = useState(
    initialFunnel?.hookHeadline || 'Obtenez votre Licence Officielle Permanente en Moins de 60s'
  );
  const [subheadline, setSubheadline] = useState(
    initialFunnel?.subheadline ||
      'Activation certifiée en 1 clic • Zéro abonnement récurrent • Mises à jour constructeur incluses'
  );
  const [architecture, setArchitecture] = useState<FunnelArchitecture>(
    initialFunnel?.architecture || 'direct'
  );
  const [themePalette, setThemePalette] = useState<FunnelThemePalette>(
    initialFunnel?.themePalette || 'cyber_dark'
  );
  const [bgPattern, setBgPattern] = useState<FunnelBackgroundPattern>(
    initialFunnel?.bgPattern || 'tech_grid'
  );
  const [targetRegion, setTargetRegion] = useState<FunnelTargetRegion>(
    initialFunnel?.targetRegion || 'gulf'
  );
  const [adPlatform, setAdPlatform] = useState<FunnelAdPlatform>(
    initialFunnel?.adPlatform || 'tiktok'
  );

  const [priceUsd, setPriceUsd] = useState<number>(initialFunnel?.priceUsd || 14.99);
  const [compareAtPriceUsd, setCompareAtPriceUsd] = useState<number>(
    initialFunnel?.compareAtPriceUsd || 99.99
  );
  const [priceDzd, setPriceDzd] = useState<number>(initialFunnel?.priceDzd || 1850);
  const [priceSar, setPriceSar] = useState<number>(initialFunnel?.priceSar || 55);

  const [heroImage, setHeroImage] = useState(
    initialFunnel?.heroImage ||
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
  );

  const [bullets, setBullets] = useState<string[]>(
    initialFunnel?.bullets || [
      'Clé authentique Microsoft Retail liée à votre compte',
      'Activation en ligne instantanée sans crack ni script tiers',
      'Mises à jour de sécurité et support constructeur à vie',
      'Garantie de remplacement immédiat 24/7',
    ]
  );
  const [newBulletText, setNewBulletText] = useState('');
  const [stockCount, setStockCount] = useState<number>(initialFunnel?.stockCount || 12);
  const [urgencyMinutes, setUrgencyMinutes] = useState<number>(initialFunnel?.urgencyMinutes || 15);
  const [orderBumpEnabled, setOrderBumpEnabled] = useState(
    initialFunnel?.orderBumpEnabled ?? true
  );

  // Auto-populate from selected catalog product
  const handleSelectProduct = (prodId: string) => {
    setProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      if (!title) setTitle(prod.title || prod.name);
      if (!slug) {
        setSlug(
          (prod.title || prod.name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        );
      }
      setPriceUsd(prod.price_usd || 19.99);
      setCompareAtPriceUsd(Math.round((prod.price_usd || 19.99) * 3));
      setPriceDzd(prod.price_dzd || 2500);
      setPriceSar(prod.price_sar || 75);
      if (prod.image) setHeroImage(prod.image);
      setHookHeadline(`Offre Exceptionnelle : ${prod.title || prod.name} à Prix Réduit`);
    }
  };

  // Add / Remove Bullets
  const handleAddBullet = () => {
    if (!newBulletText.trim()) return;
    setBullets([...bullets, newBulletText.trim()]);
    setNewBulletText('');
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  // AI Copywriting Optimization
  const handleOptimizeWithAi = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Agis en tant que copywriter élite en CRO e-commerce.
Rédige une accroche publicitaire percutante adaptée à :
- Produit : "${title || 'Logiciel Pro'}"
- Plateforme d'acquisition : "${adPlatform.toUpperCase()}"
- Architecture du funnel : "${architecture}"
- Pays cible : "${targetRegion === 'gulf' ? 'Golfe Arabique (SAR/AED)' : targetRegion === 'dz' ? 'Algérie (DZD)' : 'International (USD)'}"

Fournis un objet JSON strict avec :
1. "hookHeadline" (Accroche percutante en 1 phrase)
2. "subheadline" (Proposition de valeur convaincante)
3. "bullets" (4 puces de bénéfices majeurs)`,
        }),
      });

      if (!res.ok) throw new Error('Erreur API');
      const data = await res.json();
      const rawText = data.text || '';

      // Extract JSON if available or parse
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.hookHeadline) setHookHeadline(parsed.hookHeadline);
          if (parsed.subheadline) setSubheadline(parsed.subheadline);
          if (Array.isArray(parsed.bullets) && parsed.bullets.length > 0) {
            setBullets(parsed.bullets);
          }
          showToast('Copywriting généré et optimisé par l\'IA !', 'success');
          return;
        }
      } catch (parseErr) {
        // Fallback
      }

      // Default smart enhancement
      if (adPlatform === 'tiktok') {
        setHookHeadline(`🔥 Ne Payez Plus Vos Logiciels Trop Cher : ${title || 'Votre Clé'} en 30s`);
        setSubheadline('Offre spéciale pour la communauté TikTok • Valable encore quelques minutes');
      } else if (targetRegion === 'gulf') {
        setHookHeadline(`احصل على ${title || 'النسخة الأصلية'} بضمان رسمي وتفعيل فوري`);
        setSubheadline('ترخيص دائم بدون اشتراكات شهرية • دعم فني سريع عبر الواتساب');
      } else {
        setHookHeadline(`Économisez 85% sur votre licence ${title || 'officielle'} aujourd'hui`);
        setSubheadline('Délivrance instantanée • Clé 100% authentique constructeur garantie');
      }
      showToast('Copywriting optimisé pour la plateforme publicitaire !', 'success');
    } catch (err: any) {
      showToast('Copywriting mis à jour.', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Compile current preview object
  const currentFunnelConfig: CustomFunnelConfig = {
    id: funnelId,
    slug: slug.trim() || 'mon-funnel-pro',
    productId,
    title: title.trim() || 'Offre Spéciale NOVALYS',
    hookHeadline: hookHeadline.trim(),
    subheadline: subheadline.trim(),
    architecture,
    themePalette,
    bgPattern,
    targetRegion,
    adPlatform,
    priceUsd: Number(priceUsd),
    compareAtPriceUsd: Number(compareAtPriceUsd),
    priceDzd: Number(priceDzd),
    priceSar: Number(priceSar),
    heroImage,
    bullets,
    stockCount: Number(stockCount),
    urgencyMinutes: Number(urgencyMinutes),
    guaranteeText: 'Garantie satisfait ou remboursé sous 30 jours • Clés officielles certifiées',
    orderBumpEnabled,
    upsellEnabled: true,
    createdAt,
    updatedAt: createdAt,
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Veuillez renseigner un titre de funnel.', 'error');
      return;
    }
    if (!slug.trim()) {
      showToast('Veuillez renseigner un slug d&apos;URL unique.', 'error');
      return;
    }

    onSave(currentFunnelConfig);
    showToast(`Funnel "${title}" enregistré et prêt pour vos campagnes !`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-[#0e1626] border border-slate-700/80 rounded-3xl max-w-6xl w-full my-auto shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-slate-100 font-sans">
        {/* Top Header & Tab Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Générateur de Landing Pages &amp; Funnels CRO
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800/60">
                  Haute Conversion
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Créez des tunnels publicitaires optimisés pour TikTok Ads, Meta Ads et Google Search.
              </p>
            </div>
          </div>

          {/* Switcher: Editor vs Live Preview */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configuration</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu en Direct</span>
              </button>
            </div>

            {/* Device Frame Switcher in Preview mode */}
            {activeTab === 'preview' && (
              <div className="hidden sm:inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'
                  }`}
                  title="Aperçu Ordinateur"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'
                  }`}
                  title="Aperçu Mobile (iPhone / TikTok)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Configuration Editor */}
        {activeTab === 'editor' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
            {/* PILLAR 1: Sélection du Modèle de Funnel */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  1. Modèle Visuel &amp; Architecture CRO
                </h3>
                <span className="text-[11px] text-cyan-400 font-mono font-bold">Étape 1 sur 5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Model 1: Direct-to-Checkout */}
                <div
                  onClick={() => setArchitecture('direct')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    architecture === 'direct'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                      : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      1. Direct-to-Checkout
                    </span>
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    SaaS, clés logicielles, rapidité d&apos;achat immédiate. Mockup 3D, puces de bénéfices et formulaire simplifié.
                  </p>
                  <span className="text-[10px] font-bold block pt-1 text-cyan-400">
                    Idéal : Clés Windows, Canva, ChatGPT
                  </span>
                </div>

                {/* Model 2: Long-Form Sales Letter */}
                <div
                  onClick={() => setArchitecture('longform')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    architecture === 'longform'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      2. Long-Form Sales Letter
                    </span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    Storytelling immersif, identification des problèmes, décomposition des modules et FAQ dynamique en accordéon.
                  </p>
                  <span className="text-[10px] font-bold block pt-1 text-amber-400">
                    Idéal : Packs Premium, Formations, Bundles
                  </span>
                </div>

                {/* Model 3: Flash Sale / Urgence */}
                <div
                  onClick={() => setArchitecture('flash')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    architecture === 'flash'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500'
                      : 'bg-[#0e1626] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      3. Flash Sale / Urgence
                    </span>
                    <Clock className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    Compte à rebours temps réel, jauge de rareté du Vault, prix barré agressif et double Call-To-Action.
                  </p>
                  <span className="text-[10px] font-bold block pt-1 text-rose-400">
                    Idéal : Promos du week-end, Déstockage
                  </span>
                </div>
              </div>
            </div>

            {/* PILLAR 2: Personnalisation Visuelle & Thématique */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  2. Thème &amp; Palette Graphique
                </h3>
                <span className="text-[11px] text-purple-400 font-mono font-bold">Étape 2 sur 5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Color Palette Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Palette de Couleurs :
                  </label>
                  <select
                    value={themePalette}
                    onChange={(e) => setThemePalette(e.target.value as FunnelThemePalette)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="cyber_dark">⚡ Cyber/Dark Tech (Ardoise &amp; Cyan Électrique)</option>
                    <option value="gold_luxury">👑 Gold Luxury (Noir Profond &amp; Or Ambré)</option>
                    <option value="emerald_clean">🛡️ Emerald Clean (Reflets Vert Émeraude Sécurisé)</option>
                    <option value="custom">🎨 Mode Personnalisé</option>
                  </select>
                </div>

                {/* Background Pattern Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Motif d&apos;Arrière-Plan (Background) :
                  </label>
                  <select
                    value={bgPattern}
                    onChange={(e) => setBgPattern(e.target.value as FunnelBackgroundPattern)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="tech_grid">Grille Tech Subtile (Subtle Tech Grid)</option>
                    <option value="radial_glow">Gradient Radial Lumineux (Radial Glow)</option>
                    <option value="clean_minimal">Minimaliste Épuré (Dark Clean Minimal)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PILLAR 3 & 4: Régionalisation & Plateforme Publicitaire */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  3. Régionalisation &amp; Source de Trafic Publicitaire
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">Étape 3 sur 5</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Region */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Pays / Région Cible Principale :
                  </label>
                  <select
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value as FunnelTargetRegion)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="gulf">🇸🇦 Arabie Saoudite &amp; Golfe (Arabe RTL • SAR/AED • Apple Pay &amp; mada)</option>
                    <option value="dz">🇩🇿 Algérie (DZD • Virement BaridiMob / CCP)</option>
                    <option value="intl">🌐 International / Global (Anglais LTR • USD • Whop MoR)</option>
                  </select>
                </div>

                {/* Ad Acquisition Platform */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Canal Publicitaire d&apos;Acquisition (Trafic) :
                  </label>
                  <select
                    value={adPlatform}
                    onChange={(e) => setAdPlatform(e.target.value as FunnelAdPlatform)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="tiktok">📱 TikTok Ads (Mobile 9:16, typographie grasse, Sticky Bottom Bar)</option>
                    <option value="meta">📸 Meta / Instagram Ads (Carrousel d&apos;avis, preuve sociale)</option>
                    <option value="search">🔍 Google Search / Direct (Structure technique &amp; FAQ détaillée)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PILLAR 5: Contrôle Éditorial & Copywriting */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    4. Contrôle Éditorial &amp; Copywriting Haute Conversion
                  </h3>
                </div>

                {/* AI Optimizer Button */}
                <button
                  type="button"
                  onClick={handleOptimizeWithAi}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                  title="Reformuler automatiquement l'accroche selon la plateforme publicitaire"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'Optimisation IA...' : 'Optimiser le Copywriting avec l\'IA'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Base Product from Catalog */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Associer un Produit du Catalogue (Remplissage automatique) :
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.name} — ${p.price_usd} USD ({p.price_dzd} DA / {p.price_sar} SAR)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Funnel Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Titre Interne du Funnel *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Campagne TikTok - Windows 11 Pro"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Slug URL de Campagne (ex: /f/[slug]) *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="windows-11-pro-retail"
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Hook Headline (H1) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Titre Principal H1 (Hook Publicitaire &amp; Promesse Clé) :
                  </label>
                  <input
                    type="text"
                    value={hookHeadline}
                    onChange={(e) => setHookHeadline(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Subheadline */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Sous-Titre &amp; Proposition de Valeur :
                  </label>
                  <textarea
                    rows={2}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Hero Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Image Principale / Mockup Produit (URL) :
                  </label>
                  <input
                    type="url"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Pricing Fields */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Prix de Vente Promo ($ USD) :
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Prix Normal Barré ($ USD) :
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={compareAtPriceUsd}
                    onChange={(e) => setCompareAtPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono line-through"
                  />
                </div>

                {/* Bullets List Manager */}
                <div className="space-y-2 sm:col-span-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Bénéfices &amp; Arguments Clés (Puces) :
                  </label>

                  <div className="space-y-1.5">
                    {bullets.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e1626] border border-slate-800 text-xs"
                      >
                        <span className="text-slate-200">{b}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Ajouter un bénéfice percutant..."
                      value={newBulletText}
                      onChange={(e) => setNewBulletText(e.target.value)}
                      className="flex-1 bg-[#0e1626] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddBullet}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Preview */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 flex flex-col items-center justify-start">
            <div
              className={`w-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${
                previewDevice === 'mobile'
                  ? 'max-w-sm my-4 ring-8 ring-slate-900 rounded-[36px]'
                  : 'max-w-5xl'
              }`}
            >
              <HighConversionFunnelView funnel={currentFunnelConfig} previewMode={true} />
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'editor' && (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tester l&apos;Aperçu</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Publier &amp; Activer le Funnel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
