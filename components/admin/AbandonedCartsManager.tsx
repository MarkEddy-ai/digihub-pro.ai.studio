'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { AbandonedCart } from '@/types';
import {
  ShoppingBag,
  MessageSquare,
  Mail,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Percent,
  AlertCircle,
  Copy,
  ExternalLink,
  Phone,
  RefreshCw,
} from 'lucide-react';

export function AbandonedCartsManager() {
  const {
    abandonedCarts,
    markAbandonedCartContacted,
    deleteAbandonedCart,
    recordAbandonedCart,
    showToast,
    formatPrice,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'abandoned' | 'contacted' | 'recovered'>('all');
  const [selectedCartForPreview, setSelectedCartForPreview] = useState<AbandonedCart | null>(null);

  // Stats calculation
  const totalCarts = abandonedCarts.length;
  const abandonedCount = abandonedCarts.filter((c) => c.status === 'abandoned').length;
  const contactedCount = abandonedCarts.filter((c) => c.status === 'contacted').length;
  const recoveredCount = abandonedCarts.filter((c) => c.status === 'recovered').length;

  const totalLostAmountUsd = abandonedCarts
    .filter((c) => c.status === 'abandoned' || c.status === 'contacted')
    .reduce((sum, c) => {
      const rate = c.currency === 'DZD' ? 230 : c.currency === 'SAR' ? 3.75 : 1;
      return sum + c.totalAmount / rate;
    }, 0);

  const totalRecoveredAmountUsd = abandonedCarts
    .filter((c) => c.status === 'recovered')
    .reduce((sum, c) => {
      const rate = c.currency === 'DZD' ? 230 : c.currency === 'SAR' ? 3.75 : 1;
      return sum + c.totalAmount / rate;
    }, 0);

  const recoveryRate = totalCarts > 0 ? ((recoveredCount / totalCarts) * 100).toFixed(1) : '0.0';

  // Filtered
  const filteredCarts = abandonedCarts.filter((c) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  // Clean phone number for WhatsApp link
  const getCleanPhoneForWhatsApp = (rawPhone: string, country: string) => {
    let clean = rawPhone.replace(/[^0-9]/g, '');
    if (country === 'dz') {
      if (clean.startsWith('0')) {
        clean = '213' + clean.substring(1);
      } else if (!clean.startsWith('213')) {
        clean = '213' + clean;
      }
    } else if (country === 'sa' || country === 'ae') {
      if (clean.startsWith('0')) {
        clean = '966' + clean.substring(1);
      }
    }
    return clean;
  };

  const generateWhatsAppMessage = (cart: AbandonedCart) => {
    const firstName = cart.customerName.split(' ')[0] || 'Cher Client';
    const itemsList = cart.items.map((i) => `• ${i.productTitle} (x${i.quantity})`).join('\n');
    const isArabic = cart.country === 'sa' || cart.country === 'ae';

    if (isArabic) {
      return `مرحباً ${firstName} 👋\n\nلاحظنا اهتمامك بطلبك على منصة NOVALYS للرخص الرقمية:\n${itemsList}\n\nيسرنا تقديم خصم استثنائي 15% لإتمام طلبك فوراً باستخدام الكود: *SAUVE15*\n\nرابط إتمام الطلب الفوري:\nhttps://novalys.shop\n\nهل تحتاج أي مساعدة أو تود الدفع عبر تحويل مباشر؟ نحن بالخدمة 24/7.`;
    }

    return `Bonjour ${firstName} 👋\n\nVous étiez sur le point de commander vos licences digitales sur NOVALYS :\n${itemsList}\nTotal : ${cart.totalAmount} ${cart.currency}\n\nPour vous permettre de finaliser votre commande en toute tranquillité, nous vous offrons un code de réduction d'urgence de -15% : *SAUVE15*\n\nVos licences sont réservées pour vous pendant encore 2 heures.\nLien pour finaliser : https://novalys.shop\n\nBesoin d'aide pour le paiement par BaridiMob ou Carte ? Répondez simplement à ce message.`;
  };

  const handleLaunchWhatsAppRecovery = (cart: AbandonedCart) => {
    const cleanPhone = getCleanPhoneForWhatsApp(cart.customerPhone, cart.country);
    const message = generateWhatsAppMessage(cart);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    markAbandonedCartContacted(cart.id, 'Relancé via WhatsApp avec offre -15% (SAUVE15)');
  };

  const handleLaunchEmailRecovery = (cart: AbandonedCart) => {
    const firstName = cart.customerName.split(' ')[0] || 'Cher Partenaire';
    const subject = `[Offre -15%] Vos licences digitales NOVALYS vous attendent`;
    const body = `Bonjour ${firstName},\n\nNous avons remarqué que vous n'avez pas finalisé votre commande pour :\n${cart.items.map((i) => `- ${i.productTitle}`).join('\n')}\n\nProfitez de -15% supplémentaires avec le code promo exclusif : SAUVE15\n\nAccéder au panier : https://novalys.shop\n\nL'équipe Support NOVALYS`;
    const mailto = `mailto:${cart.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    markAbandonedCartContacted(cart.id, 'Relancé par Email avec code promo SAUVE15');
  };

  const handleSimulateNewAbandonedCart = () => {
    const isDz = Math.random() > 0.4;
    recordAbandonedCart({
      customerName: isDz ? 'Walid Belkacem' : 'Khaled Al-Ghamdi',
      customerEmail: isDz ? 'walid.belkacem@gmail.com' : 'khaled.ghamdi@yahoo.com',
      customerPhone: isDz ? '0555 12 34 56' : '+966 50 123 4567',
      country: isDz ? 'dz' : 'sa',
      wilaya: isDz ? '16 - Alger' : undefined,
      items: [
        {
          productId: 'prod-windows-11-pro',
          productTitle: 'Windows 11 Professionnel (Retail Permanente)',
          price: isDz ? 1850 : 49,
          currency: isDz ? 'DZD' : 'SAR',
          quantity: 1,
        },
      ],
      totalAmount: isDz ? 1850 : 49,
      currency: isDz ? 'DZD' : 'SAR',
      stepAbandoned: 'payment_selection',
    });
    showToast('Simulation : Nouveau panier abandonné capturé en direct !', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              Paniers Abandonnés &amp; Relances CRO
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {abandonedCount} EN ATTENTE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Récupérez jusqu&apos;à 35% de votre chiffre d&apos;affaires perdu grâce à nos relances automatiques par WhatsApp (BaridiMob/STC Pay) et Email.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulateNewAbandonedCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simuler un Abandon</span>
          </button>
        </div>
      </div>

      {/* CRO Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Abandoned count */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Paniers Non Finalisés</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {abandonedCount}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Sur {totalCarts} sessions avec intention d&apos;achat</span>
          </div>
        </div>

        {/* Card 2: CA Perdu Potentiel */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Potentiel Récupérable</span>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {formatPrice(Math.round(totalLostAmountUsd), 'USD')}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            ~{Math.round(totalLostAmountUsd * 230).toLocaleString()} DZD à sauver
          </div>
        </div>

        {/* Card 3: Montant Déjà Récupéré */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Montant Récupéré</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatPrice(Math.round(totalRecoveredAmountUsd), 'USD')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-medium">{recoveredCount} commandes sauvées</span>
          </div>
        </div>

        {/* Card 4: Taux de Récupération */}
        <div className="bg-[#0e1626] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taux de Récupération CRO</span>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {recoveryRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Moyenne e-commerce : ~11%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['all', 'abandoned', 'contacted', 'recovered'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
              activeTab === tab
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'all' && `Tous les Paniers (${totalCarts})`}
            {tab === 'abandoned' && `À Relancer (${abandonedCount})`}
            {tab === 'contacted' && `Déjà Relancés (${contactedCount})`}
            {tab === 'recovered' && `Récupérés (${recoveredCount})`}
          </button>
        ))}
      </div>

      {/* Main Abandoned Carts Table */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Sessions avec Abandon ({filteredCarts.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Code promo actif : <strong className="text-amber-300 font-mono">SAUVE15 (-15%)</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a101d] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Client &amp; Contact</th>
                <th className="py-3.5 px-4">Région / Pays</th>
                <th className="py-3.5 px-4">Contenu du Panier</th>
                <th className="py-3.5 px-4">Montant Total</th>
                <th className="py-3.5 px-4">Étape d&apos;Abandon</th>
                <th className="py-3.5 px-4">Statut &amp; Relance</th>
                <th className="py-3.5 px-4 text-right">Relance Immédiate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Customer Info */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{cart.customerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{cart.customerEmail}</span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-cyan-500" />
                      <span>{cart.customerPhone}</span>
                    </div>
                  </td>

                  {/* Country / Region */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{cart.country === 'dz' ? '🇩🇿 Algérie' : cart.country === 'sa' ? '🇸🇦 Arabie Saoudite' : '🌐 International'}</span>
                    </div>
                    {cart.wilaya && (
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {cart.wilaya}
                      </div>
                    )}
                  </td>

                  {/* Items */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-1">
                      {cart.items.map((item, idx) => (
                        <div key={idx} className="text-xs font-semibold text-slate-200">
                          {item.productTitle} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-black text-sm text-white">
                      {formatPrice(cart.totalAmount, cart.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(cart.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>

                  {/* Step Abandoned */}
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {cart.stepAbandoned === 'payment_selection' && '💳 Choix Paiement'}
                      {cart.stepAbandoned === 'checkout_details' && '📝 Saisie Coordonnées'}
                      {cart.stepAbandoned === 'cart' && '🛒 Panier d\'achat'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {cart.status === 'abandoned' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Clock className="w-3 h-3" />
                        Abandonné
                      </span>
                    )}
                    {cart.status === 'contacted' && (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Relancé
                        </span>
                        {cart.recoveryNote && (
                          <div className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate" title={cart.recoveryNote}>
                            {cart.recoveryNote}
                          </div>
                        )}
                      </div>
                    )}
                    {cart.status === 'recovered' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Vente Récupérée !
                      </span>
                    )}
                  </td>

                  {/* Actions (WhatsApp / Email) */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleLaunchWhatsAppRecovery(cart)}
                        title="Relancer par WhatsApp avec offre -15%"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLaunchEmailRecovery(cart)}
                        title="Relancer par Email"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAbandonedCart(cart.id)}
                        title="Supprimer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
