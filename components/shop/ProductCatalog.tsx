'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { CategoryId, Platform, ProductType } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export function ProductCatalog() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice,
  } = useShop();

  // Filters state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popularity');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const platformsList: Platform[] = ['Windows', 'macOS', 'Web', 'Android', 'iOS', 'Xbox'];
  const typesList: { id: ProductType; label: string }[] = [
    { id: 'subscription', label: 'Abonnement' },
    { id: 'lifetime', label: 'Licence à vie' },
    { id: 'license_key', label: 'Clé d\'activation' },
    { id: 'credits', label: 'Crédits / Recharge' },
  ];

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const toggleType = (t: ProductType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPlatforms([]);
    setSelectedTypes([]);
    setMaxPrice(25000);
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('popularity');
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query) || product.fullDescription.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesCategory = product.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTagline && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Platform
      if (selectedPlatforms.length > 0) {
        const hasPlatform = selectedPlatforms.some((p) => product.platforms.includes(p));
        if (!hasPlatform) return false;
      }

      // Product Type
      if (selectedTypes.length > 0) {
        if (!product.productType || !selectedTypes.includes(product.productType)) return false;
      }

      // Price
      if (product.price > maxPrice) {
        return false;
      }

      // In stock
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedPlatforms, selectedTypes, maxPrice, onlyInStock, sortBy]);

  const activeCategoryObject = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="py-8 sm:py-12 bg-[#0B0F17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>Catalogue Officiel</span>
            <span>·</span>
            <span>Délivrance Instantanée</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeCategoryObject ? activeCategoryObject.name : 'Tous les Produits & Licences Numériques'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
            {activeCategoryObject
              ? activeCategoryObject.description
              : 'Trouvez la licence logicielle, l\'outil d\'intelligence artificielle ou l\'abonnement parfait au tarif le plus bas garanti.'}
          </p>
        </div>

        {/* Top Control Bar: Search + Quick Mobile Filter Button + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par nom, logiciel, mots-clés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-8 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtres</span>
              {(selectedPlatforms.length > 0 || selectedTypes.length > 0 || selectedCategory !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline text-slate-400">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="popularity" className="bg-slate-900 text-white">Popularité</option>
                <option value="price-asc" className="bg-slate-900 text-white">Prix : Croissant</option>
                <option value="price-desc" className="bg-slate-900 text-white">Prix : Décroissant</option>
                <option value="rating" className="bg-slate-900 text-white">Meilleurs avis</option>
                <option value="newest" className="bg-slate-900 text-white">Nouveautés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Desktop / Mobile Drawer */}
          <aside
            className={`${
              isMobileFilterOpen
                ? 'fixed inset-0 z-50 bg-[#0B0F17]/95 p-6 overflow-y-auto block'
                : 'hidden lg:block'
            } lg:relative lg:p-0 space-y-6`}
          >
            {isMobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 lg:hidden">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span>Filtres &amp; Critères</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Filter Reset Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Filtres appliqués
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Tout réinitialiser
              </button>
            </div>

            {/* Category filter */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Catégories
              </h4>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>Toutes les catégories</span>
                <span className="text-[10px] text-slate-400">{products.length}</span>
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {products.filter((p) => p.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Price filter slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider">Prix maximum</h4>
                <span className="font-mono font-bold text-cyan-400">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 000 DA</span>
                <span>12 500 DA</span>
                <span>25 000 DA</span>
              </div>
            </div>

            {/* Platform filter */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Plateforme / OS
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {platformsList.map((platform) => {
                  const isChecked = selectedPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
                        isChecked
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{platform}</span>
                      {isChecked && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Type filter */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Type de produit
              </h4>
              <div className="space-y-1">
                {typesList.map((t) => {
                  const isChecked = selectedTypes.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleType(t.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between border transition-colors ${
                        isChecked
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 font-medium'
                          : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{t.label}</span>
                      {isChecked && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile apply button */}
            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
              >
                Afficher les résultats ({filteredProducts.length})
              </button>
            )}
          </aside>

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            {/* Result count & active chips */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800/80">
              <div>
                <strong className="text-white font-mono">{filteredProducts.length}</strong>{' '}
                produits trouvés
              </div>

              {(selectedPlatforms.length > 0 || selectedTypes.length > 0 || maxPrice < 100 || selectedCategory !== 'all') && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Filtres actifs</span>
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Effacer tout
                  </button>
                </div>
              )}
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">Aucun produit ne correspond à ces critères</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Essayez d&apos;élargir votre recherche, de réinitialiser vos filtres ou de modifier votre prix maximum.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold mt-2"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
