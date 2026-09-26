'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminStatsCards } from './AdminStatsCards';
import { KeyVaultManager } from './KeyVaultManager';
import { ProductPricingManager } from './ProductPricingManager';
import { OrderWorkflowTable } from './OrderWorkflowTable';
import { PaymentGatewaysManager } from './PaymentGatewaysManager';
import { FunnelsManager } from './FunnelsManager';
import { CrmManager } from './CrmManager';
import { AffiliatesManager } from './AffiliatesManager';
import { AbandonedCartsManager } from './AbandonedCartsManager';
import { ReviewsProofManager } from './ReviewsProofManager';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { GoogleSheetsManager } from './GoogleSheetsManager';
import { SimulateOrderModal } from './SimulateOrderModal';
import { NewProductModal } from './NewProductModal';
import {
  PackageCheck,
  Clock,
  KeyRound,
  DollarSign,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: AdminTab;
}

export function AdminDashboard({ initialTab = 'overview' }: AdminDashboardProps) {
  const { adminStats } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#080d1a] text-slate-100 overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Vertical Fixed Sidebar on the Left */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
        onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
      />

      {/* Main Scrollable Work Area on the Right (offset by w-64) */}
      <main className="flex-1 ml-64 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#080d1a]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick KPI stats with < 3 units alerts */}
            <AdminStatsCards
              onNavigateToVault={() => setActiveTab('vault')}
              onNavigateToOrders={() => setActiveTab('orders')}
            />

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Validation BaridiMob */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-[#0e1626] hover:bg-[#121c30] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {adminStats.pendingOrders} en attente
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Validation des Virements BaridiMob
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspectez les captures de reçus clients et délivrez les clés en 1 clic.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-amber-400 font-semibold">
                  <span>Accéder aux commandes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Box 2: Coffre de clés Textarea */}
              <div
                onClick={() => setActiveTab('vault')}
                className="bg-[#0e1626] hover:bg-[#121c30] p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {adminStats.totalKeysRemaining} clés en stock
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Insertion en Masse au Coffre
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Collez vos listes de clés (Plati / GGsel) dans le champ texte (une par ligne).
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
                  <span>Gérer l&apos;inventaire digital</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Box 3: Tarifs & Marges Multi-devises */}
              <div
                onClick={() => setActiveTab('pricing')}
                className="bg-[#0e1626] hover:bg-[#121c30] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    8 Devises Supportées
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Multi-Devises &amp; Calcul de Marge
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Définissez vos prix DZD/SAR/USD/etc. selon vos coûts d&apos;achat sources.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <span>Ajuster la rentabilité</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Box 4: Google Sheets Sync */}
              <div
                onClick={() => setActiveTab('sheets')}
                className="bg-[#0e1626] hover:bg-[#121c30] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    OAuth 2.0
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Synchronisation Google Sheets
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exportez vos commandes et inventaires de licences directement sur votre Drive.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <span>Connecter &amp; Exporter</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Embedded Live Order Workflow Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-cyan-400" />
                  Dernières Commandes en Cours
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir le tableau complet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <OrderWorkflowTable />
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS WORKFLOW */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <OrderWorkflowTable />
          </div>
        )}

        {/* TAB 3: KEY VAULT (DIGITAL INVENTORY) */}
        {activeTab === 'vault' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <KeyVaultManager />
          </div>
        )}

        {/* TAB 4: PRICING & MULTI-CURRENCY */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ProductPricingManager onOpenNewProductModal={() => setIsNewProductModalOpen(true)} />
          </div>
        )}

        {/* TAB 5: PAYMENT GATEWAYS & MULTI-CURRENCY SETTINGS */}
        {activeTab === 'gateways' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <PaymentGatewaysManager />
          </div>
        )}

        {/* TAB 6: FUNNELS & LANDING PAGES ENGINE */}
        {activeTab === 'funnels' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <FunnelsManager />
          </div>
        )}

        {/* TAB: CRM & RETARGETING CLIENTS */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CrmManager />
          </div>
        )}

        {/* TAB 7: AFFILIATION & INFLUENCERS */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AffiliatesManager />
          </div>
        )}

        {/* TAB 8: ABANDONED CARTS & CRO RECOVERY */}
        {activeTab === 'abandoned' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AbandonedCartsManager />
          </div>
        )}

        {/* TAB 9: REVIEWS & SOCIAL PROOF */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ReviewsProofManager />
          </div>
        )}

        {/* TAB 10: ANALYTICS & CRO */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AdminAnalyticsDashboard />
          </div>
        )}

        {/* TAB 8: GOOGLE SHEETS SYNC */}
        {activeTab === 'sheets' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <GoogleSheetsManager />
          </div>
        )}
      </main>

      {/* Simulator Modal */}
      {isSimulateModalOpen && (
        <SimulateOrderModal
          onClose={() => setIsSimulateModalOpen(false)}
          onSuccess={() => {
            setActiveTab('orders');
          }}
        />
      )}

      {/* New Product Creator Modal */}
      {isNewProductModalOpen && (
        <NewProductModal
          isOpen={isNewProductModalOpen}
          onClose={() => setIsNewProductModalOpen(false)}
          onSuccess={() => {
            setActiveTab('pricing');
          }}
        />
      )}
    </div>
  );
}
