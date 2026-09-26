'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import {
  LayoutDashboard,
  KeyRound,
  DollarSign,
  PackageCheck,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Globe2,
  Flame,
  BarChart3,
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'overview' | 'orders' | 'vault' | 'pricing' | 'gateways' | 'funnels' | 'analytics';
  setActiveTab: (tab: 'overview' | 'orders' | 'vault' | 'pricing' | 'gateways' | 'funnels' | 'analytics') => void;
  onOpenSimulateModal: () => void;
}

export function AdminHeader({ activeTab, setActiveTab, onOpenSimulateModal }: AdminHeaderProps) {
  const { adminUser, logoutAdmin, adminStats, setActiveTab: setStorefrontTab, resetDefaultCatalog } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  NOVALYS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Back-Office
                </span>
              </div>
              <p className="text-xs text-slate-400">Digital Vault & Order Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Vue d&apos;ensemble
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              Validation Commandes
              {adminStats.pendingOrders > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 animate-pulse">
                  {adminStats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              Coffre de Clés
              {adminStats.lowStockCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {adminStats.lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Catalogue &amp; Marges
            </button>

            <button
              onClick={() => setActiveTab('gateways')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'gateways'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              Passerelles &amp; Devises
            </button>

            <button
              onClick={() => setActiveTab('funnels')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'funnels'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Funnels Meta/TikTok
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Analytics &amp; CRO
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Simulate Order button */}
            <button
              onClick={onOpenSimulateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all hover:scale-105 shadow-sm"
              title="Tester les workflows de commandes automatiques ou manuelles BaridiMob"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Simuler Commande</span>
            </button>

            {/* Visit Storefront */}
            <button
              onClick={() => {
                setStorefrontTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/60 transition-all"
              title="Voir la boutique côté client"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Boutique</span>
            </button>

            {/* Reset data helper */}
            <button
              onClick={() => {
                if (window.confirm('Réinitialiser le catalogue, le coffre de clés et les commandes avec les données de base ?')) {
                  resetDefaultCatalog();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
              title="Réinitialiser les données de démo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-slate-200">{adminUser?.name || 'Administrateur'}</p>
                <p className="text-[10px] text-emerald-400">En ligne (SuperAdmin)</p>
              </div>

              <button
                onClick={logoutAdmin}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Vue d&apos;ensemble
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap relative ${
              activeTab === 'orders' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Commandes {adminStats.pendingOrders > 0 && `(${adminStats.pendingOrders})`}
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap relative ${
              activeTab === 'vault' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Coffre {adminStats.lowStockCount > 0 && `(${adminStats.lowStockCount})`}
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'pricing' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Catalogue &amp; Marges
          </button>
          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'gateways' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Passerelles &amp; Devises
          </button>
          <button
            onClick={() => setActiveTab('funnels')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'funnels' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Funnels Ads
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Analytics &amp; CRO
          </button>
        </div>
      </div>
    </header>
  );
}
