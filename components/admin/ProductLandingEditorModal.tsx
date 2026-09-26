'use client';

import React, { useState } from 'react';
import { FunnelProductOffer } from '@/data/funnelOffers';
import { useShop } from '@/context/ShopContext';
import {
  X,
  Sparkles,
  Save,
  Trash2,
  Plus,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  Palette,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  FileText,
  Smartphone,
  Flame,
  Globe2,
} from 'lucide-react';

interface ProductLandingEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: FunnelProductOffer | null;
  onSave: (updated: FunnelProductOffer) => void;
  onDelete?: (id: string) => void;
}

export function ProductLandingEditorModal({
  isOpen,
  onClose,
  product,
  onSave,
  onDelete,
}: ProductLandingEditorModalProps) {
  const { showToast } = useShop();

  const isNew = !product;

  // Form State
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [subtitle, setSubtitle] = useState(
    product?.subtitle || 'Activation officielle certifiée • Livraison instantanée • Garantie à vie'
  );
  const [badge, setBadge] = useState(product?.badge || 'TOP VENTE TIKTOK & META');
  const [image, setImage] = useState(
    product?.image ||
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
  );
  const [palette, setPalette] = useState<'cyber_dark' | 'gold_luxury' | 'emerald_clean'>(
    product?.palette || 'cyber_dark'
  );
  const [trafficSource, setTrafficSource] = useState<'tiktok' | 'meta' | 'google'>(
    product?.trafficSource || 'tiktok'
  );

  // Pricing & Margin State
  const [priceUsd, setPriceUsd] = useState<number>(product?.priceUsd ?? 14.99);
  const [priceDzd, setPriceDzd] = useState<number>(product?.priceDzd ?? 1850);
  const [priceSar, setPriceSar] = useState<number>(product?.priceSar ?? 49);
  const [costPriceUsd, setCostPriceUsd] = useState<number>(product?.costPriceUsd ?? 2.5);

  // Bullets / Highlights
  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights || [
      'Clé officielle authentique 100% permanente à vie',
      'Activation directe sans script tiers ni crack',
      'Mises à jour constructeur et assistance VIP incluses',
      'Garantie de remplacement immédiat 24/7',
    ]
  );
  const [newBulletText, setNewBulletText] = useState('');

  // Urgency & Guarantee
  const [stockRemaining, setStockRemaining] = useState<number>(product?.stockRemaining ?? 5);
  const [urgencyMinutes, setUrgencyMinutes] = useState<number>(product?.urgencyMinutes ?? 15);
  const [guaranteeNotice, setGuaranteeNotice] = useState(
    product?.guaranteeNotice || 'Garantie 100% activation officielle • Remplacement sous 15 min'
  );

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  // Real-time Margin Calculation
  const netMarginUsd = Math.max(0, priceUsd - costPriceUsd);
  const marginPercentage = priceUsd > 0 ? Math.round((netMarginUsd / priceUsd) * 100) : 0;

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      setSlug(
        val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleAddBullet = () => {
    if (!newBulletText.trim()) return;
    setHighlights([...highlights, newBulletText.trim()]);
    setNewBulletText('');
  };

  const handleRemoveBullet = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAiCopywriting = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Tu es un expert mondial en copywriting publicitaire et optimisation de taux de conversion (CRO) pour les produits numériques.
Génère pour le produit : "${title || 'Logiciel Pro'}" ciblant la source : "${trafficSource.toUpperCase()}".
Réponds au format JSON strict avec les clés suivantes :
{
  "subtitle": "Proposition de valeur percutante en 1 phrase courte",
  "badge": "Badge percutant (ex: TENDANCE TIKTOK 2026)",
  "bullets": ["Bénéfice majeur 1", "Bénéfice majeur 2", "Bénéfice majeur 3", "Bénéfice majeur 4"],
  "guarantee": "Texte court rassurant avec garantie"
}`,
        }),
      });

      if (!res.ok) throw new Error('API non disponible');
      const data = await res.json();
      const rawText = data.text || '';

      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.subtitle) setSubtitle(parsed.subtitle);
        if (parsed.badge) setBadge(parsed.badge);
        if (Array.isArray(parsed.bullets) && parsed.bullets.length > 0) {
          setHighlights(parsed.bullets);
        }
        if (parsed.guarantee) setGuaranteeNotice(parsed.guarantee);
        showToast('Argumentaire et copywriting générés avec l\'IA !', 'success');
        return;
      }
      throw new Error('Fallback requis');
    } catch {
      // Smart Fallback
      if (trafficSource === 'tiktok') {
        setBadge('🔥 TENDANCE VIRALE TIKTOK');
        setSubtitle('Ne payez plus le plein tarif : activez votre licence officielle en 30 secondes');
        setHighlights([
          'Clé 100% authentique constructeur sans abonnement',
          'Activation instantanée sur votre propre machine',
          'Code promo et support ultra-rapide sur WhatsApp',
          'Prix spécial communauté TikTok limité à aujourd\'hui',
        ]);
      } else {
        setBadge('💎 SÉLECTION OFFICIELLE');
        setSubtitle('Licence perpétuelle garantie constructeur • Mises à jour incluses');
        setHighlights([
          'Authentification directe auprès des serveurs éditeur',
          'Délivrance immédiate dans votre coffre sécurisé',
          'Assistance technique francophone 7j/7',
          'Facture certifiée et reçu officiel fournis',
        ]);
      }
      showToast('Copywriting optimisé appliqué !', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Veuillez renseigner un titre pour le produit.', 'error');
      return;
    }
    if (!slug.trim()) {
      showToast('Veuillez renseigner un slug URL.', 'error');
      return;
    }

    const updatedProduct: FunnelProductOffer = {
      id: product?.id || `prod-custom-${Date.now()}`,
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      rating: product?.rating || 4.96,
      reviewCount: product?.reviewCount || 1240,
      image: image.trim(),
      originalPriceUsd: Math.round(priceUsd * 2.5),
      priceUsd: Number(priceUsd),
      priceDzd: Number(priceDzd),
      priceSar: Number(priceSar),
      priceAed: Math.round(Number(priceSar) * 0.98),
      priceKwd: Number((Number(priceSar) * 0.08).toFixed(1)),
      costPriceUsd: Number(costPriceUsd),
      palette,
      trafficSource,
      stockRemaining: Number(stockRemaining),
      urgencyMinutes: Number(urgencyMinutes),
      guaranteeNotice: guaranteeNotice.trim(),
      highlights: highlights.filter((h) => h.trim().length > 0),
      packs: product?.packs || [
        {
          id: 'pack-std',
          name: 'Pack 1 Licence',
          durationLabel: 'Usage Permanent',
          multiplier: 1.0,
          discountPercent: 75,
          isPopular: true,
        },
      ],
      activationSteps: product?.activationSteps || [
        {
          step: 1,
          title: 'Accédez au logiciel',
          description: 'Téléchargez l\'application officielle sur le site constructeur.',
        },
        {
          step: 2,
          title: 'Saisissez la clé',
          description: 'Entrez la clé de licence délivrée dans votre coffre numérique.',
        },
        {
          step: 3,
          title: 'Activation immédiate',
          description: 'Profitez de votre produit actif à vie sans limitation !',
        },
      ],
    };

    onSave(updatedProduct);
    showToast(`Produit "${title}" enregistré avec succès !`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0B0F19] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isNew ? 'Créer une Nouvelle Landing Page Produit' : `Modifier la Landing Page : ${title}`}
              </h2>
              <p className="text-xs text-slate-400">
                Personnalisez le copywriting, les tarifs multi-devises et l&apos;architecture de conversion CRO.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-200">
          {/* SECTION 1: Informations de Base & H1 */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Informations Clés &amp; Titre H1
              </h3>

              <button
                type="button"
                onClick={handleAiCopywriting}
                disabled={isGeneratingAi}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-purple-500/20 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Génération IA en cours...' : 'Optimiser le Copywriting avec l\'IA'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Titre Commercial Accrocheur (H1) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Windows 11 Professionnel (Licence Retail Permanente)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Slug d&apos;URL <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-500 mr-1 font-mono">/p/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="mon-produit"
                    className="w-full bg-transparent text-cyan-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Sous-Titre Persuasif / Proposition de Valeur
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Proposition persuasive en une phrase pour retenir l'attention du visiteur..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Badge Visuel</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="ex: TOP VENTE TIKTOK & META"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold uppercase focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['BESTSELLER', 'TENDANCE VIRALE', 'PACK ÉCONOMIQUE -85%'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setBadge(tag)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Tarification Multi-Devises & Marge Nette */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Tarification Multi-Devises &amp; Marge Nette
              </h3>

              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Marge Nette : <strong>{marginPercentage}%</strong> (+${netMarginUsd.toFixed(2)})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300">Prix USD ($ Ref)</label>
                <div className="flex items-center gap-1 text-white">
                  <span className="text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono text-sm font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300">Coût d&apos;Achat Source ($)</label>
                <div className="flex items-center gap-1 text-white">
                  <span className="text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={costPriceUsd}
                    onChange={(e) => setCostPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono text-sm font-bold text-rose-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300">🇩🇿 Prix DZD (Algérie)</label>
                <div className="flex items-center gap-1 text-white">
                  <input
                    type="number"
                    step="50"
                    value={priceDzd}
                    onChange={(e) => setPriceDzd(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">DA</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300">🇸🇦 Prix SAR (Golfe)</label>
                <div className="flex items-center gap-1 text-white">
                  <input
                    type="number"
                    step="1"
                    value={priceSar}
                    onChange={(e) => setPriceSar(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono text-sm font-bold text-cyan-300 focus:outline-none"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">SAR</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Médias, Thème Visuel & Source de Trafic */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Visuels, Palette Graphique &amp; Trafic
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">URL de l&apos;Image / Mockup</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Palette Thématique</label>
                <select
                  value={palette}
                  onChange={(e) => setPalette(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="cyber_dark">Cyber Dark (Bleu Néon &amp; Ardoise)</option>
                  <option value="gold_luxury">Gold Luxury (Or Prestige &amp; Noir)</option>
                  <option value="emerald_clean">Emerald Clean (Émeraude Sécurité)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Canal Publicitaire Cible</label>
                <select
                  value={trafficSource}
                  onChange={(e) => setTrafficSource(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="tiktok">TikTok Ads (Conversion Rapide, FOMO)</option>
                  <option value="meta">Meta Ads (Instagram &amp; Facebook)</option>
                  <option value="google">Google Search &amp; Direct</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: Arguments de Vente (Bullets) & Urgence */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Puces Bénéfices &amp; Déclencheurs Psychologiques
            </h3>

            {/* Bullets List */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300">
                Puces Bénéfices Majeures (Affichées sous le prix)
              </label>
              <div className="space-y-1.5">
                {highlights.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const updated = [...highlights];
                        updated[idx] = e.target.value;
                        setHighlights(updated);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add bullet input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBullet();
                    }
                  }}
                  placeholder="Ajouter un bénéfice supplémentaire..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Urgency & Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minuteur d&apos;Urgence (Minutes)</span>
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={urgencyMinutes}
                  onChange={(e) => setUrgencyMinutes(parseInt(e.target.value) || 15)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stock Restant Affiché</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={stockRemaining}
                  onChange={(e) => setStockRemaining(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Garantie</span>
                </label>
                <input
                  type="text"
                  value={guaranteeNotice}
                  onChange={(e) => setGuaranteeNotice(e.target.value)}
                  placeholder="Garantie 100% activation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/60">
          <div>
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Confirmez-vous la suppression du produit "${title}" ?`)) {
                    onDelete(product.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer le Produit</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{isNew ? 'Créer le Produit' : 'Enregistrer les Modifications'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
