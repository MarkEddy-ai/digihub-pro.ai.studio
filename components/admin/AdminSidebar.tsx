'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import { AdminNavItem } from './AdminNavItem';
import {
  LayoutDashboard,
  CheckSquare,
  Key,
  Tag,
  Globe,
  Flame,
  LineChart,
  FileSpreadsheet,
  Sparkles,
  ExternalLink,
  LogOut,
  Plus,
  Users,
  UserCheck,
  ShoppingBag,
  Star,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'vault'
  | 'pricing'
  | 'gateways'
  | 'funnels'
  | 'crm'
  | 'affiliates'
  | 'abandoned'
  | 'reviews'
  | 'analytics'
  | 'sheets';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onOpenSimulateModal: () => void;
  onOpenNewProductModal?: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  onOpenSimulateModal,
  onOpenNewProductModal,
}: AdminSidebarProps) {
  const { adminStats, crmCustomers, abandonedCarts, logoutAdmin, setActiveTab: setStorefrontTab } = useShop();

  const recentAbandonedCount = abandonedCarts
    ? abandonedCarts.filter((c) => c.status === 'abandoned').length
    : 0;

  return (
    <aside className="w-64 fixed top-0 bottom-0 left-0 z-30 shrink-0 h-screen bg-[#0e1626] border-r border-slate-800 flex flex-col justify-between select-none">
      {/* Top Header & Logo */}
      <div className="p-5 border-b border-slate-800/80">
        <NovalysLogo variant="admin" size="md" />
      </div>

      {/* Vertical Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Quick Add Product Primary Action */}
        {onOpenNewProductModal && (
          <div className="px-1 pb-3">
            <button
              type="button"
              onClick={onOpenNewProductModal}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Nouveau Produit</span>
            </button>
          </div>
        )}

        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          Menu Principal
        </div>

        <AdminNavItem
          icon={LayoutDashboard}
          label="Vue d'ensemble"
          isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />

        <AdminNavItem
          icon={CheckSquare}
          label="Validation Commandes"
          isActive={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          badge={adminStats.pendingOrders > 0 ? adminStats.pendingOrders : undefined}
          badgeVariant="yellow"
        />

        <AdminNavItem
          icon={Key}
          label="Coffre de Clés"
          isActive={activeTab === 'vault'}
          onClick={() => setActiveTab('vault')}
          badge={adminStats.lowStockCount > 0 ? adminStats.lowStockCount : undefined}
          badgeVariant="red"
        />

        <AdminNavItem
          icon={Tag}
          label="Catalogue & Marges"
          isActive={activeTab === 'pricing'}
          onClick={() => setActiveTab('pricing')}
        />

        <AdminNavItem
          icon={Globe}
          label="Passerelles & Devises"
          isActive={activeTab === 'gateways'}
          onClick={() => setActiveTab('gateways')}
        />

        <AdminNavItem
          icon={Flame}
          label="Funnels Meta/TikTok"
          isActive={activeTab === 'funnels'}
          onClick={() => setActiveTab('funnels')}
          badge="HOT"
          badgeVariant="orange"
        />

        <AdminNavItem
          icon={UserCheck}
          label="CRM & Fidélisation"
          isActive={activeTab === 'crm'}
          onClick={() => setActiveTab('crm')}
          badge={crmCustomers.length > 0 ? crmCustomers.length : undefined}
          badgeVariant="blue"
        />

        <AdminNavItem
          icon={Users}
          label="Gestion Affiliation & Influenceurs"
          isActive={activeTab === 'affiliates'}
          onClick={() => setActiveTab('affiliates')}
          badge="25%"
          badgeVariant="purple"
        />

        <AdminNavItem
          icon={ShoppingBag}
          label="Paniers Abandonnés"
          isActive={activeTab === 'abandoned'}
          onClick={() => setActiveTab('abandoned')}
          badge={recentAbandonedCount > 0 ? recentAbandonedCount : undefined}
          badgeVariant="orange"
        />

        <AdminNavItem
          icon={Star}
          label="Avis & Preuve Sociale"
          isActive={activeTab === 'reviews'}
          onClick={() => setActiveTab('reviews')}
        />

        <AdminNavItem
          icon={LineChart}
          label="Analytics & CRO"
          isActive={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        />

        <AdminNavItem
          icon={FileSpreadsheet}
          label="Google Sheets Sync"
          isActive={activeTab === 'sheets'}
          onClick={() => setActiveTab('sheets')}
          badge="SYNC"
          badgeVariant="green"
        />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2 bg-[#0a101d]">
        <button
          type="button"
          onClick={onOpenSimulateModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simuler Commande</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setStorefrontTab('home');
              window.location.href = '/';
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Consulter la boutique client"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Boutique</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sortir</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
