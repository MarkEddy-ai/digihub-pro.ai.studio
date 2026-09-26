'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Product, ProductOption, ProductReview } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  Star,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  HelpCircle,
  Cpu,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface ProductLandingPageProps {
  slug: string;
}

export function ProductLandingPage({ slug }: ProductLandingPageProps) {
  const {
    products,
    openProductPage,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
    formatPrice,
    setActiveTab,
    setSelectedCategory,
    showToast,
  } = useShop();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(
    product.options && product.options.length > 0 ? product.options[0] : undefined
  );
  const [activeTabSection, setActiveTabSection] = useState<'description' | 'included' | 'specs' | 'activation' | 'faq'>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Reviews state with adding capability
  const [reviews, setReviews] = useState<ProductReview[]>(product.reviews || []);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Handle sticky buy bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPrice = selectedOption ? product.price + selectedOption.priceDelta : product.price;
  const originalPriceCalculated = selectedOption
    ? product.originalPrice + selectedOption.priceDelta * 1.5
    : product.originalPrice;
  const savings = Math.max(0, originalPriceCalculated - currentPrice);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image, 'https://picsum.photos/seed/tech-workspace-dashboard/800/600', 'https://picsum.photos/seed/license-security-code/800/600'];

  const handleAddToCart = () => {
    addToCart(product, selectedOption, quantity);
  };

  const handleInstantBuy = () => {
    addToCart(product, selectedOption, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      const created: ProductReview = {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor,
        rating: newReviewRating,
        date: 'À l\'instant',
        verified: true,
        title: 'Avis suite à achat récent',
        comment: newReviewComment,
      };
      setReviews([created, ...reviews]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setIsSubmittingReview(false);
      showToast('Merci ! Votre avis a été enregistré et publié.');
    }, 600);
  };

  // Similar products in same category
  const similarProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const fallbackSimilar = similarProducts.length > 0
    ? similarProducts
    : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <article className="min-h-screen bg-[#0B0F17] pb-24 text-slate-100">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-3 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={() => {
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            Boutique
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={() => {
              setSelectedCategory(product.category);
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-cyan-400 hover:underline"
          >
            {product.categoryLabel}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Hero / Purchase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Visual Media Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-cyan-500 text-slate-950 shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700">
                  {product.productTypeLabel}
                </span>
              </div>

              {/* Instant Delivery badge */}
              <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Livraison automatisée en {product.deliveryTime}</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-400/20'
                      : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Feature highlights bar */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="font-semibold text-white">100% Officiel</div>
                <div className="text-[10px] text-slate-400">Clé certifiée</div>
              </div>
              <div className="space-y-1">
                <Clock className="w-5 h-5 text-cyan-400 mx-auto" />
                <div className="font-semibold text-white">&lt; 60 secondes</div>
                <div className="text-[10px] text-slate-400">Délivrance e-mail</div>
              </div>
              <div className="space-y-1">
                <Download className="w-5 h-5 text-blue-400 mx-auto" />
                <div className="font-semibold text-white">Guide PDF inclus</div>
                <div className="text-[10px] text-slate-400">Notice illustrée</div>
              </div>
              <div className="space-y-1">
                <Lock className="w-5 h-5 text-purple-400 mx-auto" />
                <div className="font-semibold text-white">Garantie 30j</div>
                <div className="text-[10px] text-slate-400">Remplacement direct</div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, pricing, options, CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-cyan-400 font-semibold uppercase tracking-wider">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold font-mono text-white text-sm">{product.rating}</span>
                  <span className="text-slate-400">({reviews.length} avis vérifiés)</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  {formatPrice(currentPrice)}
                </span>
                {originalPriceCalculated > currentPrice && (
                  <span className="text-base text-slate-400 line-through font-mono">
                    {formatPrice(originalPriceCalculated)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    Économisez {formatPrice(savings)}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>Paiement unique sans prélèvement récurrent forcé</span>
                <span className="text-emerald-400 font-medium">Stock : {product.stockCount} dispo</span>
              </div>
            </div>

            {/* Options / Formule Selector */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sélectionnez votre formule ou durée :
                </label>
                <div className="space-y-2">
                  {product.options.map((opt) => {
                    const isSelected = selectedOption?.value === opt.value;
                    const optPrice = product.price + opt.priceDelta;

                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/40 text-white'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </span>
                          <div>
                            <div className="text-sm font-semibold">{opt.label}</div>
                            {opt.durationLabel && (
                              <div className="text-[11px] text-slate-400">Durée : {opt.durationLabel}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono text-cyan-300">
                            {formatPrice(optPrice)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Platforms compatibility row */}
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold text-slate-300">Plateformes :</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.platforms.map((plat) => (
                  <span key={plat} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Stock Indicator */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-300 block">Quantité :</label>
                <div className="text-[10px] text-slate-400">
                  {product.stockCount > 0 ? (
                    <span className="text-emerald-400 font-medium">En stock ({product.stockCount} disponibles)</span>
                  ) : (
                    <span className="text-rose-400 font-medium">Rupture de stock</span>
                  )}
                </div>
              </div>

              <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  title="Diminuer la quantité"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-mono font-bold text-white min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  title="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleInstantBuy}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Acheter maintenant (Livraison &lt; 60s)</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Ajouter au panier</span>
              </button>
            </div>

            {/* Micro assurance */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Réception immédiate du code &amp; guide par email</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Support prioritaire à l&apos;activation à cherchellsgpp@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured SEO Landing Content Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-800">
          {[
            { id: 'description', label: 'Description & Bénéfices' },
            { id: 'included', label: 'Ce qui est inclus' },
            { id: 'specs', label: 'Spécifications & Prérequis' },
            { id: 'activation', label: 'Guide d\'activation (< 2 min)' },
            { id: 'faq', label: 'FAQ du produit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTabSection === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="pt-8">
          {/* 1. Description */}
          {activeTabSection === 'description' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">À propos de {product.name}</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Fonctionnalités &amp; Avantages majeurs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Ce qui est inclus */}
          {activeTabSection === 'included' && (
            <div className="max-w-4xl space-y-4">
              <h3 className="text-xl font-bold text-white">Contenu exact livré avec votre commande</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Chaque élément ci-dessous est transmis automatiquement dès validation du paiement.
              </p>
              <div className="space-y-2.5 pt-2">
                {product.whatIsIncluded.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-sm text-slate-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-mono shrink-0">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Specs */}
          {activeTabSection === 'specs' && (
            <div className="max-w-4xl space-y-4">
              <h3 className="text-xl font-bold text-white">Configuration système requise</h3>
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block text-xs">Systèmes d&apos;exploitation supportés :</span>
                    <strong className="text-white">{product.systemRequirements.os}</strong>
                  </div>
                  {product.systemRequirements.processor && (
                    <div>
                      <span className="text-slate-400 block text-xs">Processeur / Architecture :</span>
                      <strong className="text-white">{product.systemRequirements.processor}</strong>
                    </div>
                  )}
                  {product.systemRequirements.ram && (
                    <div>
                      <span className="text-slate-400 block text-xs">Mémoire vive (RAM) recommandée :</span>
                      <strong className="text-white">{product.systemRequirements.ram}</strong>
                    </div>
                  )}
                  {product.systemRequirements.disk && (
                    <div>
                      <span className="text-slate-400 block text-xs">Espace disque disponible :</span>
                      <strong className="text-white">{product.systemRequirements.disk}</strong>
                    </div>
                  )}
                </div>
                {product.systemRequirements.extra && (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <strong>Note technique :</strong> {product.systemRequirements.extra}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Activation Guide */}
          {activeTabSection === 'activation' && (
            <div className="max-w-4xl space-y-4">
              <h3 className="text-xl font-bold text-white">Comment activer votre clé en 3 étapes simples</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {product.activationGuide.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-bold font-mono flex items-center justify-center text-sm">
                      {step.step}
                    </div>
                    <h4 className="text-sm font-bold text-white pt-1">{step.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. FAQ */}
          {activeTabSection === 'faq' && (
            <div className="max-w-4xl space-y-3">
              <h3 className="text-xl font-bold text-white mb-2">Questions fréquentes sur {product.name}</h3>
              {product.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="text-sm font-semibold text-cyan-300">{faq.question}</div>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section with Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Avis de nos clients ({reviews.length})</h3>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold font-mono text-white text-sm">{product.rating} / 5</span>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-semibold text-slate-200 ml-1.5">{rev.title}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leave a review box */}
          <div className="lg:col-span-5">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white">Vous utilisez ce produit ? Donnez votre avis</h4>
              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Votre nom ou prénom</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="Ex: Thomas G."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Note globale</label>
                  <div className="flex items-center gap-2">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewReviewRating(r)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs border ${
                          newReviewRating === r
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-700'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Votre commentaire d&apos;expérience</label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Délai de réception, clarté de l'installation, fonctionnement..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  {isSubmittingReview ? 'Publication en cours...' : 'Publier mon avis vérifié'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Sell / Similar Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Produits similaires recommandés</h3>
            <p className="text-xs text-slate-400 mt-0.5">Complétez votre équipement numérique avec nos meilleures offres.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {fallbackSimilar.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Permanent Sticky Buy Bar on Scroll (Mobile & Desktop) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-700 p-3 sm:p-4 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0 hidden sm:block"
              />
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate">{product.name}</div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Livraison &lt; 60s par email</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-lg sm:text-xl font-mono font-extrabold text-white">
                  {formatPrice(currentPrice)}
                </div>
              </div>

              <button
                onClick={handleInstantBuy}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-md active:scale-95"
              >
                Acheter maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
