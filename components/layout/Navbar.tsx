'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import { CATEGORIES } from '@/data/categories';
import { translations, Language } from '@/data/translations';
import {
  ShoppingBag,
  KeyRound,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    cartCount,
    setIsCartOpen,
    setIsVaultOpen,
    searchQuery,
    setSearchQuery,
    orders,
  } = useShop();

  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const t = translations[currentLang];

  const totalVaultLicenses = orders.reduce(
    (sum, ord) => sum + (ord.licenses ? ord.licenses.length : 0),
    0
  );

  const handleNavClick = (tab: any, category?: any) => {
    setActiveTab(tab);
    if (category) {
      setSelectedCategory(category);
    }
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top micro-bar: announcements */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-cyan-950/60 border-b border-cyan-900/30 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-slate-300">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              {t.secureBanner}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300">
              {t.instantDelivery}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-amber-300/90 font-mono">
              {t.promoCode}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-400">
            <span className="text-slate-300 hidden sm:inline text-xs">
              {t.support24}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <NovalysLogo
              variant="store"
              size="md"
              onClick={() => handleNavClick('home')}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {t.home}
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                onBlur={() => setTimeout(() => setIsCategoryMenuOpen(false), 250)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{t.catalog}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200" />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('catalog', 'all')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-950/40 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.allCatalog}</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                      All
                    </span>
                  </button>
                  <div className="grid grid-cols-1 gap-0.5 max-h-72 overflow-y-auto mt-1 pr-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleNavClick('catalog', cat.id)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          selectedCategory === cat.id && activeTab === 'catalog'
                            ? 'bg-cyan-950/60 text-cyan-300'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {cat.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('promotions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'promotions'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.promotions}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {t.about}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {t.contact}
            </button>
          </nav>

          {/* Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Area: Language Switcher + Licenses + Cart */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'fr'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('ar')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'ar'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عربي
              </button>
            </div>

            {/* License Vault Button */}
            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Accéder à vos clés et licences activées"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{t.licenses}</span>
              {totalVaultLicenses > 0 && (
                <span className="ml-1 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full border border-cyan-500/40">
                  {totalVaultLicenses}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline font-bold">{t.cart}</span>
              {cartCount > 0 ? (
                <span className="bg-slate-950 text-cyan-300 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center font-mono">
                  {cartCount}
                </span>
              ) : (
                <span className="text-[11px] opacity-80">(0)</span>
              )}
            </button>

            {/* Mobile Burger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-4 space-y-3 animate-in fade-in">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-xl text-left text-sm font-medium ${
                activeTab === 'home' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t.home}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('catalog', 'all')}
              className={`p-2.5 rounded-xl text-left text-sm font-medium ${
                activeTab === 'catalog' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t.allCatalog}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('promotions')}
              className={`p-2.5 rounded-xl text-left text-sm font-medium ${
                activeTab === 'promotions' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              🔥 {t.promotions}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`p-2.5 rounded-xl text-left text-sm font-medium ${
                activeTab === 'about' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t.about}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`p-2.5 rounded-xl text-left text-sm font-medium col-span-2 ${
                activeTab === 'contact' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t.contact}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}