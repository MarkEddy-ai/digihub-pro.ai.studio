'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { PaymentGatewayId, Currency, OrderPaymentMethod } from '@/types';
import { SUPPORTED_CURRENCIES } from '@/data/paymentGateways';
import {
  CreditCard,
  DollarSign,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Key,
  Lock,
  Building,
  Smartphone,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export function PaymentGatewaysManager() {
  const {
    paymentGateways,
    updateGatewaySettings,
    toggleGateway,
    exchangeRates,
    updateExchangeRate,
    simulateIncomingOrder,
    showToast,
  } = useShop();

  const [activeGatewayId, setActiveGatewayId] = useState<PaymentGatewayId>('baridimob');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Dedicated BaridiMob state
  const baridimobGateway = paymentGateways.baridimob;
  const [bmRip, setBmRip] = useState(baridimobGateway?.credentials?.accountRip || '00799999000123456789');
  const [bmHolder, setBmHolder] = useState(baridimobGateway?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES (ALGÉRIE)');
  const [bmCcp, setBmCcp] = useState(baridimobGateway?.credentials?.accountCcp || '23456789 Clé 42');
  const [bmEnabled, setBmEnabled] = useState(baridimobGateway?.enabled ?? true);

  // Form state for active gateway
  const activeGateway = paymentGateways[activeGatewayId];

  const [publishableKey, setPublishableKey] = useState(activeGateway?.credentials?.publishableKey || '');
  const [secretKey, setSecretKey] = useState(activeGateway?.credentials?.secretKey || '');
  const [clientId, setClientId] = useState(activeGateway?.credentials?.clientId || '');
  const [accountRip, setAccountRip] = useState(activeGateway?.credentials?.accountRip || '');
  const [accountCcp, setAccountCcp] = useState(activeGateway?.credentials?.accountCcp || '');
  const [accountHolder, setAccountHolder] = useState(activeGateway?.credentials?.accountHolder || '');
  const [isTestMode, setIsTestMode] = useState(activeGateway?.testMode ?? true);

  const handleSaveBaridiMobDedicated = (e: React.FormEvent) => {
    e.preventDefault();
    updateGatewaySettings('baridimob', {
      enabled: bmEnabled,
      credentials: {
        accountRip: bmRip.trim(),
        accountHolder: bmHolder.trim(),
        accountCcp: bmCcp.trim(),
      },
    });
    setAccountRip(bmRip.trim());
    setAccountHolder(bmHolder.trim());
    setAccountCcp(bmCcp.trim());
    showToast('Coordonnées BaridiMob enregistrées et synchronisées avec toutes les pages et le checkout !', 'success');
  };

  // Sync state when active gateway changes
  const handleSelectGateway = (id: PaymentGatewayId) => {
    setActiveGatewayId(id);
    const gtw = paymentGateways[id];
    setPublishableKey(gtw?.credentials?.publishableKey || '');
    setSecretKey(gtw?.credentials?.secretKey || '');
    setClientId(gtw?.credentials?.clientId || '');
    setAccountRip(gtw?.credentials?.accountRip || '');
    setAccountCcp(gtw?.credentials?.accountCcp || '');
    setAccountHolder(gtw?.credentials?.accountHolder || '');
    setIsTestMode(gtw?.testMode ?? true);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateGatewaySettings(activeGatewayId, {
      testMode: isTestMode,
      credentials: {
        publishableKey: publishableKey.trim() || undefined,
        secretKey: secretKey.trim() || undefined,
        clientId: clientId.trim() || undefined,
        accountRip: accountRip.trim() || undefined,
        accountCcp: accountCcp.trim() || undefined,
        accountHolder: accountHolder.trim() || undefined,
      },
    });
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    showToast('Copié dans le presse-papiers', 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              Passerelles de Paiement &amp; Multi-Devises
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configurez vos passerelles de paiement unifiées pour le Golfe (Tap / PayTabs), l&apos;International (Stripe / PayPal) et l&apos;Algérie (BaridiMob / CCP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateIncomingOrder('tap_mada_auto')}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5"
            title="Tester un paiement automatisé mada / Arabie Saoudite"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Tester Tap / mada</span>
          </button>
          <button
            onClick={() => simulateIncomingOrder('tap_knet_auto')}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 transition-all flex items-center gap-1.5"
            title="Tester un paiement KNET / Koweït"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Tester KNET</span>
          </button>
        </div>
      </div>

      {/* Encadré Dédié : Configuration BaridiMob / Algérie Poste */}
      <div className="bg-gradient-to-br from-amber-950/30 via-[#0e1626] to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-500/20 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 shrink-0">
              🇩🇿
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Configuration BaridiMob / Algérie Poste
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  bmEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {bmEnabled ? 'BaridiMob Actif sur Boutique' : 'Désactivé'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ces coordonnées sont synchronisées en temps réel sur le Checkout et toutes les landing pages lorsque la région Algérie (DZD) est sélectionnée.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <label className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold cursor-pointer select-none bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span>Statut :</span>
              <button
                type="button"
                onClick={() => setBmEnabled(!bmEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  bmEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
              </button>
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveBaridiMobDedicated} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* RIP */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Numéro RIP BaridiMob / CCP *</span>
                <span className="text-[10px] text-amber-400 font-mono">20 chiffres</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={bmRip}
                  onChange={(e) => setBmRip(e.target.value)}
                  placeholder="00799999000123456789"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-300 font-mono font-bold tracking-wider placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(bmRip, 'bm_rip')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  title="Copier le RIP"
                >
                  {copiedField === 'bm_rip' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Account Holder */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nom &amp; Prénom du Titulaire du Compte *
              </label>
              <input
                type="text"
                required
                value={bmHolder}
                onChange={(e) => setBmHolder(e.target.value)}
                placeholder="Ex: NOVALYS DIGITAL SERVICES (ALGÉRIE)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            {/* CCP Number */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Numéro Compte CCP &amp; Clé
              </label>
              <input
                type="text"
                value={bmCcp}
                onChange={(e) => setBmCcp(e.target.value)}
                placeholder="Ex: 23456789 Clé 42"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Synchronisé automatiquement avec le Checkout et les Landing Pages Algérie (DZD)</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les coordonnées BaridiMob</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gateway Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tap Payments */}
        <div
          onClick={() => handleSelectGateway('tap_payments')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'tap_payments'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-purple-400">
                  TAP
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Tap Payments
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    Golfe / GCC
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">mada, KNET, Apple Pay, STC Pay</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('tap_payments');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.tap_payments?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.tap_payments?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇸🇦 SAR</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇰🇼 KWD</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇦🇪 AED</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇶🇦 QAR</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇧🇭 BHD</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇴🇲 OMR</span>
          </div>
        </div>

        {/* Stripe */}
        <div
          onClick={() => handleSelectGateway('stripe')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'stripe'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-indigo-400">
                  STRIPE
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Stripe
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    International
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Cartes Visa/Mastercard, Google Pay, Apple Pay</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('stripe');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.stripe?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.stripe?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🌐 USD ($)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇦🇪 AED</span>
          </div>
        </div>

        {/* BaridiMob Algérie */}
        <div
          onClick={() => handleSelectGateway('baridimob')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'baridimob'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-amber-400">
                  BMOB
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  BaridiMob / CCP
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    Algérie (Manuel)
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Virement + Reçu client avec validation admin</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('baridimob');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.baridimob?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.baridimob?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇩🇿 DZD (DA)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Reçu Obligatoire</span>
          </div>
        </div>

        {/* PayPal */}
        <div
          onClick={() => handleSelectGateway('paypal')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'paypal'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-blue-400">
                  PP
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  PayPal Checkout
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                    Express
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Compte PayPal & Cartes</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('paypal');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.paypal?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.paypal?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🌐 USD ($)</span>
          </div>
        </div>

        {/* PayTabs GCC Alternative */}
        <div
          onClick={() => handleSelectGateway('paytabs')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'paytabs'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-emerald-400">
                  PT
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  PayTabs
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    GCC Alt.
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">mada, Apple Pay, OmanNet</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('paytabs');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.paytabs?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.paytabs?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇸🇦 SAR</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🇦🇪 AED</span>
          </div>
        </div>

        {/* Crypto USDT */}
        <div
          onClick={() => handleSelectGateway('crypto')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeGatewayId === 'crypto'
              ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-emerald-400">
                  USDT
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Crypto USDT
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    TRC20
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Binance Pay / TRON Network</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGateway('crypto');
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                paymentGateways.crypto?.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {paymentGateways.crypto?.enabled ? 'Actif' : 'Inactif'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">🌐 USD ($)</span>
          </div>
        </div>
      </div>

      {/* Gateway Configuration & API Credentials Form */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Configuration : {activeGateway?.name}
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                activeGateway?.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {activeGateway?.enabled ? 'Passerelle Active' : 'Passerelle Désactivée'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Renseignez vos clés API et identifiants marchands sécurisés pour cette passerelle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Mode Sandbox / Test</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          {/* BaridiMob specific credentials */}
          {activeGatewayId === 'baridimob' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Numéro RIP BaridiMob (20 chiffres) :
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountRip}
                    onChange={(e) => setAccountRip(e.target.value)}
                    placeholder="007 99999 0023456789 42"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(accountRip, 'rip')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {copiedField === 'rip' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Ce RIP sera affiché aux acheteurs algériens sur l&apos;écran de paiement.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Compte CCP &amp; Clé :
                </label>
                <input
                  type="text"
                  value={accountCcp}
                  onChange={(e) => setAccountCcp(e.target.value)}
                  placeholder="23456789 Clé 42"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom du Titulaire du Compte :
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="NOVALYS DIGITAL SERVICES (ALGÉRIE)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ) : activeGatewayId === 'paypal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayPal Client ID :
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="AU_PayPal_Client_Demo_..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayPal Secret Key :
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ) : activeGatewayId === 'crypto' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Adresse Portefeuille USDT (TRC20) :
              </label>
              <input
                type="text"
                value={accountRip}
                onChange={(e) => setAccountRip(e.target.value)}
                placeholder="TXvNovalysUSDTAddressTRC20DepositOnly789"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Clé Publique / Publishable Key ({activeGatewayId === 'tap_payments' ? 'Tap API Key' : 'Stripe PK'}) :
                </label>
                <input
                  type="text"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder={activeGatewayId === 'tap_payments' ? 'pk_test_TAP_...' : 'pk_test_...'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Clé Secrète / Secret Key :
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="sk_test_••••••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Identifiants</span>
            </button>
          </div>
        </form>
      </div>

      {/* Multi-Currency & Reference Rates Configuration */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Taux de Change de Référence &amp; Devises Supportées
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ces taux sont utilisés pour convertir les prix et calculer avec exactitude la marge bénéficiaire nette par rapport au coût source sur Plati en USD.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(SUPPORTED_CURRENCIES) as Currency[]).map((curCode) => {
            const cur = SUPPORTED_CURRENCIES[curCode];
            const currentRate = exchangeRates[curCode] || cur.rateToUsd;

            return (
              <div
                key={curCode}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cur.flag}</span>
                    <div>
                      <span className="font-bold text-xs text-white">{curCode}</span>
                      <p className="text-[10px] text-slate-400">{cur.country}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {cur.symbol}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">1 USD =</span>
                    <span className="font-mono font-bold text-cyan-300">
                      {currentRate} {curCode}
                    </span>
                  </div>

                  {curCode !== 'USD' && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <input
                        type="number"
                        step="any"
                        defaultValue={currentRate}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0 && val !== currentRate) {
                            updateExchangeRate(curCode, val);
                          }
                        }}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
