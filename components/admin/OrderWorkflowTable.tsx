'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { Order, OrderStatus, Currency } from '@/types';
import {
  PackageCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  Clock,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Smartphone,
  Coins,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ProofViewerModal } from './ProofViewerModal';
import { DeliverySuccessModal } from './DeliverySuccessModal';

export function OrderWorkflowTable() {
  const {
    orders,
    validateAndDeliverOrder,
    rejectOrder,
    formatPrice,
    showToast,
  } = useShop();

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'refunded'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [deliveredModalData, setDeliveredModalData] = useState<{
    order: Order;
    key: string;
  } | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === 'pending') {
        if (order.status !== 'pending_verification' && order.status !== 'pending_proof' && order.status !== 'pending') {
          return false;
        }
      } else if (statusFilter === 'completed') {
        if (order.status !== 'completed' && order.status !== 'delivered') {
          return false;
        }
      } else if (statusFilter === 'refunded') {
        if (order.status !== 'refunded' && order.status !== 'cancelled') {
          return false;
        }
      }

      // Currency filter
      if (currencyFilter !== 'all') {
        if ((order.currency || 'DZD') !== currencyFilter) return false;
      }

      // Method / Gateway filter
      if (methodFilter !== 'all') {
        const m = order.payment_method || order.paymentMethod || 'baridimob';
        const g = order.gateway || (
          m === 'baridimob' || m === 'ccp' ? 'baridimob'
          : ['mada', 'knet', 'benefit_pay', 'naps', 'omannet', 'stc_pay'].includes(m) ? 'tap_payments'
          : m === 'paypal' ? 'paypal'
          : m === 'crypto' ? 'crypto'
          : 'stripe'
        );

        if (m !== methodFilter && g !== methodFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOrder = order.orderNumber.toLowerCase().includes(q);
        const matchesClient =
          `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(q) ||
          order.customer.phone.includes(q) ||
          (order.customer.email && order.customer.email.toLowerCase().includes(q));
        const matchesProduct = order.items?.some((i) => i.productName.toLowerCase().includes(q));

        if (!matchesOrder && !matchesClient && !matchesProduct) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, currencyFilter, methodFilter, searchQuery]);

  // Handle Validate and Deliver
  const handleValidateOrder = (orderId: string) => {
    const res = validateAndDeliverOrder(orderId);
    if (res.success && res.deliveredKey) {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setDeliveredModalData({
          order: updatedOrder,
          key: res.deliveredKey,
        });
      }
    }
  };

  // Handle Reject
  const handleRejectOrder = (orderId: string) => {
    const reason = window.prompt(
      'Motif du rejet du reçu BaridiMob :',
      'Numéro de transaction introuvable ou montant incorrect.'
    );
    if (reason !== null) {
      rejectOrder(orderId, reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-white tracking-wide">
                Workflow de Validation des Commandes
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gérez les commandes automatiques (Stripe / Apple Pay / Crypto) et vérifiez les virements manuels (BaridiMob / CCP).
            </p>
          </div>

          {/* Quick counts */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              Total affiché : <strong className="text-cyan-300 font-mono">{filteredOrders.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Status Tabs */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Filtrer par Statut :
            </label>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Livré
              </button>
              <button
                onClick={() => setStatusFilter('refunded')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'refunded'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annulé
              </button>
            </div>
          </div>

          {/* Currency Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Filtrer par Devise :
            </label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">Toutes les devises</option>
              <option value="USD">USD ($ - International)</option>
              <option value="DZD">DZD (DA - Algérie)</option>
              <option value="SAR">SAR (SR - Arabie Saoudite)</option>
              <option value="AED">AED (AED - Émirats)</option>
              <option value="KWD">KWD (KD - Koweït)</option>
              <option value="QAR">QAR (QR - Qatar)</option>
              <option value="BHD">BHD (BD - Bahreïn)</option>
              <option value="OMR">OMR (OMR - Oman)</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Passerelle &amp; Méthode :
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Toutes les passerelles</option>
              <option value="baridimob">BaridiMob / CCP (Manuel Algérie)</option>
              <option value="stripe">Stripe (Cartes Visa/MC, Apple Pay)</option>
              <option value="paypal">PayPal Checkout</option>
              <option value="tap_payments">Tap Payments (Unifiée Golfe / GCC)</option>
              <option value="mada">mada (Arabie Saoudite)</option>
              <option value="knet">KNET (Koweït)</option>
              <option value="crypto">Crypto USDT TRC20</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Recherche Instantanée :
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="N° commande, client, tél..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold bg-slate-950/60">
                <th className="py-3.5 px-4">Commande &amp; Date</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Article Commandé</th>
                <th className="py-3.5 px-4">Montant &amp; Devise</th>
                <th className="py-3.5 px-4">Passerelle &amp; Preuve</th>
                <th className="py-3.5 px-4">Marge Nette</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Clé Attribuée</th>
                <th className="py-3.5 px-4 text-right">Actions Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Aucune commande ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isPending =
                    ord.status === 'pending_verification' ||
                    ord.status === 'pending_proof' ||
                    ord.status === 'pending';
                  const isCompleted = ord.status === 'completed' || ord.status === 'delivered';
                  const isRefunded = ord.status === 'refunded' || ord.status === 'cancelled';

                  const method = ord.payment_method || ord.paymentMethod || 'baridimob';
                  const currency = ord.currency || 'DZD';
                  const amount = ord.total_amount || ord.total;

                  const primaryItem = ord.items?.[0];

                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isPending ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white text-xs block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">
                          {ord.customer.firstName} {ord.customer.lastName}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">{ord.customer.phone}</p>
                        {ord.customer.email && (
                          <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {ord.customer.email}
                          </p>
                        )}
                        {ord.customer.city && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-slate-950 text-slate-400 border border-slate-800">
                            {ord.customer.city}
                          </span>
                        )}
                      </td>

                      {/* Product Ordered */}
                      <td className="py-3.5 px-4">
                        {primaryItem ? (
                          <div className="flex items-center gap-2 max-w-[200px]">
                            <img
                              src={primaryItem.productImage}
                              alt={primaryItem.productName}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-200 truncate text-xs">
                                {primaryItem.productName}
                              </p>
                              {primaryItem.optionLabel && (
                                <span className="text-[10px] text-slate-500 block">
                                  {primaryItem.optionLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Total Amount & Currency */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sm text-cyan-300 block">
                          {formatPrice(amount, currency)}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-slate-500">
                          Devise : {currency}
                        </span>
                      </td>

                      {/* Payment Method & Proof Receipt */}
                      <td className="py-3.5 px-4">
                        {method === 'baridimob' || method === 'ccp' ? (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              BaridiMob / CCP
                            </span>

                            {/* Clickable Receipt Thumbnail */}
                            {ord.payment_proof_url ? (
                              <button
                                onClick={() => setSelectedProofOrder(ord)}
                                className="group flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-500/60 transition-all text-[10px] text-amber-200"
                                title="Inspecter le reçu de virement BaridiMob"
                              >
                                <img
                                  src={ord.payment_proof_url}
                                  alt="Miniature Reçu"
                                  className="w-6 h-6 rounded object-cover"
                                />
                                <span className="group-hover:underline">Voir le Reçu</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 block">Aucun reçu joint</span>
                            )}
                          </div>
                        ) : method === 'mada' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            Tap (mada 🇸🇦)
                          </span>
                        ) : method === 'knet' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            Tap (KNET 🇰🇼)
                          </span>
                        ) : method === 'paypal' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            PayPal Express
                          </span>
                        ) : method === 'stripe' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <CreditCard className="w-3 h-3" /> Stripe (Carte)
                          </span>
                        ) : method === 'apple_pay' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            <Smartphone className="w-3 h-3" /> Apple Pay (Auto)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Coins className="w-3 h-3" /> Crypto USDT
                          </span>
                        )}
                      </td>

                      {/* Net Profit Margin */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-xs text-emerald-400 block">
                          +${(ord.net_profit_usd || 12).toFixed(1)} USD
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Coût: ${(ord.cost_price_usd || 10).toFixed(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/40 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            En attente vérif.
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Complétée (Livré)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Annulé / Rejeté
                          </span>
                        )}
                      </td>

                      {/* Delivered Key */}
                      <td className="py-3.5 px-4">
                        {ord.delivered_secret_data ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="px-2 py-1 rounded bg-slate-950 border border-cyan-500/30 text-cyan-300 truncate max-w-[120px]">
                              {ord.delivered_secret_data}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(ord.delivered_secret_data || '');
                                showToast('Clé copiée !', 'info');
                              }}
                              className="p-1 rounded text-slate-400 hover:text-cyan-400"
                              title="Copier la clé"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[11px]">— Pas encore attribuée</span>
                        )}
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleValidateOrder(ord.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
                                title="Valider le virement BaridiMob, décrémenter le stock et délivrer la clé"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>[Valider et Envoyer la Clé]</span>
                              </button>

                              <button
                                onClick={() => handleRejectOrder(ord.id)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                                title="Rejeter la commande (Reçu invalide)"
                              >
                                [Rejeter]
                              </button>
                            </>
                          ) : isCompleted ? (
                            <button
                              onClick={() => {
                                setDeliveredModalData({
                                  order: ord,
                                  key: ord.delivered_secret_data || 'CLÉ-DIGITALE-ACTIVATION',
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-all"
                              title="Afficher la clé délivrée et générer le message client"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Voir Clé Client</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Dossier clôturé</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Viewer Modal (BaridiMob Lightbox) */}
      {selectedProofOrder && (
        <ProofViewerModal
          order={selectedProofOrder}
          onClose={() => setSelectedProofOrder(null)}
          onValidate={(orderId) => {
            handleValidateOrder(orderId);
            setSelectedProofOrder(null);
          }}
          onReject={(orderId) => {
            handleRejectOrder(orderId);
            setSelectedProofOrder(null);
          }}
        />
      )}

      {/* Delivery Success Modal (Key attributed with WhatsApp / SMS dispatch) */}
      {deliveredModalData && (
        <DeliverySuccessModal
          order={deliveredModalData.order}
          deliveredKey={deliveredModalData.key}
          onClose={() => setDeliveredModalData(null)}
        />
      )}
    </div>
  );
}
