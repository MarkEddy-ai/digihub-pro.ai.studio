'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Currency, OrderPaymentMethod, PaymentGatewayId, Order } from '@/types';
import { SUPPORTED_CURRENCIES } from '@/data/paymentGateways';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Upload,
  Coins,
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  Mail,
  User,
  Globe2,
} from 'lucide-react';

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    discountAmount,
    finalTotal,
    appliedPromo,
    selectedCurrency,
    setSelectedCurrency,
    paymentGateways,
    formatPrice,
    placeOrder,
    latestOrder,
    setLatestOrder,
    setActiveTab,
    showToast,
  } = useShop();

  // Customer form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Payment method selection
  const [activePaymentMethod, setActivePaymentMethod] = useState<OrderPaymentMethod>(() => {
    return selectedCurrency === 'DZD' ? 'baridimob' : selectedCurrency === 'SAR' ? 'mada' : 'stripe';
  });

  // BaridiMob manual proof fields
  const [transactionRef, setTransactionRef] = useState('');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRip, setCopiedRip] = useState(false);

  if (!isCheckoutOpen) return null;

  // Change currency and auto-adapt payment method
  const handleCurrencyChange = (newCurrency: Currency) => {
    setSelectedCurrency(newCurrency);
    if (newCurrency === 'DZD') {
      setActivePaymentMethod('baridimob');
    } else if (newCurrency === 'SAR') {
      setActivePaymentMethod('mada');
    } else if (newCurrency === 'KWD') {
      setActivePaymentMethod('knet');
    } else if (newCurrency === 'AED') {
      setActivePaymentMethod('card');
    } else if (newCurrency === 'BHD') {
      setActivePaymentMethod('benefit_pay');
    } else if (newCurrency === 'QAR') {
      setActivePaymentMethod('naps');
    } else if (newCurrency === 'OMR') {
      setActivePaymentMethod('omannet');
    } else {
      setActivePaymentMethod('stripe');
    }
  };

  // Submit order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Une adresse e-mail valide est indispensable pour la délivrance de la clé digitale.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Determine assigned gateway
      let gtw: PaymentGatewayId = 'stripe';
      if (activePaymentMethod === 'baridimob' || activePaymentMethod === 'ccp') {
        gtw = 'baridimob';
      } else if (activePaymentMethod === 'paypal') {
        gtw = 'paypal';
      } else if (
        ['mada', 'knet', 'benefit_pay', 'naps', 'omannet', 'stc_pay'].includes(activePaymentMethod) ||
        selectedCurrency === 'SAR' ||
        selectedCurrency === 'AED'
      ) {
        gtw = 'tap_payments';
      } else if (activePaymentMethod === 'crypto') {
        gtw = 'crypto';
      }

      const order = placeOrder(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || 'Non renseigné',
          wilaya: selectedCurrency === 'DZD' ? '16 - Alger' : 'International',
          city: selectedCurrency === 'SAR' ? 'Riyadh' : selectedCurrency === 'DZD' ? 'Alger' : 'Client Web',
          address: 'Livraison digitale par e-mail',
          notes: transactionRef ? `Réf Virement: ${transactionRef} | ${notes}` : notes,
        },
        0, // 0 delivery fee for instant digital products
        activePaymentMethod,
        selectedCurrency,
        gtw,
        activePaymentMethod === 'baridimob' ? proofUrl : undefined
      );

      setIsSubmitting(false);

      if (activePaymentMethod === 'baridimob' || activePaymentMethod === 'ccp') {
        setIsCheckoutOpen(false);
        window.location.href = `/commande/${order.id}/paiement`;
      }
    }, 800);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    showToast('Clé d\'activation copiée dans le presse-papier !', 'success');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLatestOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {latestOrder
                  ? 'Commande Enregistrée avec Succès !'
                  : 'Paiement Sécurisé & Livraison Immédiate'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {latestOrder
                  ? 'Retrouvez votre clé d\'activation ci-dessous'
                  : 'Produits digitaux officiels • Clés CD délivrées instantanément'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {latestOrder ? (
          /* ================= SUCCESS CONFIRMATION SCREEN ================= */
          <div className="p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            {latestOrder.status === 'completed' ? (
              /* AUTOMATED ORDER SUCCESS (Instant Key Delivery) */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Paiement Confirmé &amp; Clé Délivrée !
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Merci {latestOrder.customer.firstName} ! Votre clé d&apos;activation officielle est prête ci-dessous.
                  </p>
                </div>

                {/* Delivered Key Highlight Box */}
                {latestOrder.delivered_secret_data && (
                  <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-indigo-950/70 border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" />
                        Votre Clé d&apos;Activation Digitale :
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        100% Officielle
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-cyan-500/40">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-cyan-300 select-all tracking-wider break-all">
                        {latestOrder.delivered_secret_data}
                      </span>
                      <button
                        onClick={() => handleCopyKey(latestOrder.delivered_secret_data || '')}
                        className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedKey ? 'Copiée !' : 'Copier'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Activez cette clé sur la plateforme correspondante (Steam, Windows, etc.). Un e-mail de confirmation a également été envoyé à <strong className="text-slate-200">{latestOrder.customer_email || latestOrder.customer.email}</strong>.
                    </p>
                  </div>
                )}

                {/* Order Details Summary */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">N° de Commande :</span>
                    <span className="font-mono font-bold text-white">{latestOrder.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Passerelle :</span>
                    <span className="font-semibold text-cyan-400 uppercase">
                      {latestOrder.gateway || latestOrder.payment_method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Montant réglé :</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatPrice(latestOrder.total, latestOrder.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* BARIDIMOB MANUAL VERIFICATION SUCCESS SCREEN */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 animate-pulse">
                    <Clock className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Virement BaridiMob en Attente de Vérification
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Votre commande <strong className="text-amber-400 font-mono">{latestOrder.orderNumber}</strong> a été transmise à notre équipe.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Workflow de vérification manuelle :</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    L&apos;administrateur examine votre reçu de virement BaridiMob directement dans le Back-Office (<strong>/admin</strong>). Dès validation du reçu, votre clé digitale vous sera envoyée par e-mail et SMS sous quelques minutes.
                  </p>
                </div>

                {latestOrder.payment_proof_url && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Reçu joint à la commande :</span>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      <img
                        src={latestOrder.payment_proof_url}
                        alt="Reçu client"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Back-office Quick Link */}
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Visualiser cette commande dans le tableau de bord :
              </span>
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('admin');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <span>Aller au Back-Office</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              Fermer et retourner au catalogue
            </button>
          </div>
        ) : (
          /* ================= CHECKOUT FORM ================= */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            {/* 1. Multi-Currency Selector Bar */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  Devise de Paiement :
                </span>
                <span className="text-[10px] text-cyan-400 font-mono lowercase">
                  taux en temps réel
                </span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {(Object.keys(SUPPORTED_CURRENCIES) as Currency[]).map((curCode) => {
                  const c = SUPPORTED_CURRENCIES[curCode];
                  const isSelected = selectedCurrency === curCode;

                  return (
                    <button
                      key={curCode}
                      type="button"
                      onClick={() => handleCurrencyChange(curCode)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold scale-105'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-base">{c.flag}</div>
                      <div className="text-[11px] font-mono font-bold mt-0.5">{curCode}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Available Payment Gateways for the Selected Currency */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Moyen de Paiement ({selectedCurrency}) :
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {selectedCurrency === 'DZD' ? 'Validation manuelle' : 'Livraison instantanée'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* ALGERIA: BARIDIMOB / CCP */}
                {selectedCurrency === 'DZD' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod('baridimob')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        activePaymentMethod === 'baridimob'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">📱</span>
                      <div>
                        <div className="text-xs font-bold text-white">BaridiMob (Algérie Poste)</div>
                        <div className="text-[11px] text-slate-400">Virement RIP instantané • Vérification du reçu</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod('ccp')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        activePaymentMethod === 'ccp'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">🏦</span>
                      <div>
                        <div className="text-xs font-bold text-white">Versement CCP Guichet</div>
                        <div className="text-[11px] text-slate-400">Bordereau postal jaune • Validation manuelle</div>
                      </div>
                    </button>
                  </>
                )}

                {/* SAUDI ARABIA: MADA, APPLE PAY, STC PAY */}
                {selectedCurrency === 'SAR' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod('mada')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        activePaymentMethod === 'mada'
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">💳</span>
                      <div>
                        <div className="text-xs font-bold text-white">Cartes mada (مدى)</div>
                        <div className="text-[11px] text-slate-400">Passerelle Tap Payments • Clé immédiate</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod('apple_pay')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        activePaymentMethod === 'apple_pay'
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">🍏</span>
                      <div>
                        <div className="text-xs font-bold text-white">Apple Pay</div>
                        <div className="text-[11px] text-slate-400">Paiement en 1 clic avec FaceID</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentMethod('stc_pay')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        activePaymentMethod === 'stc_pay'
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">🟣</span>
                      <div>
                        <div className="text-xs font-bold text-white">STC Pay</div>
                        <div className="text-[11px] text-slate-400">Portefeuille mobile saoudien</div>
                      </div>
                    </button>
                  </>
                )}

                {/* KUWAIT: KNET */}
                {selectedCurrency === 'KWD' && (
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod('knet')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      activePaymentMethod === 'knet'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">🇰🇼</span>
                    <div>
                      <div className="text-xs font-bold text-white">KNET (Kuwait Net)</div>
                      <div className="text-[11px] text-slate-400">Réseau bancaire koweïtien officiel</div>
                    </div>
                  </button>
                )}

                {/* UAE / QATAR / BAHRAIN / OMAN */}
                {['AED', 'QAR', 'BHD', 'OMR'].includes(selectedCurrency) && (
                  <button
                    type="button"
                    onClick={() => setActivePaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      activePaymentMethod === 'card'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">💳</span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {selectedCurrency === 'BHD'
                          ? 'BenefitPay / Carte Débit'
                          : selectedCurrency === 'QAR'
                          ? 'NAPS / Cartes Bancaires'
                          : selectedCurrency === 'OMR'
                          ? 'OmanNet / Cartes Débit'
                          : 'Cartes Bancaires & Apple Pay'}
                      </div>
                      <div className="text-[11px] text-slate-400">Passerelle Tap Payments unifiée Golfe</div>
                    </div>
                  </button>
                )}

                {/* INTERNATIONAL: STRIPE & PAYPAL */}
                <button
                  type="button"
                  onClick={() => setActivePaymentMethod('stripe')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    activePaymentMethod === 'stripe'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">💳</span>
                  <div>
                    <div className="text-xs font-bold text-white">Stripe Checkout</div>
                    <div className="text-[11px] text-slate-400">Visa, Mastercard, Apple Pay, Google Pay</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePaymentMethod('paypal')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    activePaymentMethod === 'paypal'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">🅿️</span>
                  <div>
                    <div className="text-xs font-bold text-white">PayPal</div>
                    <div className="text-[11px] text-slate-400">Solde PayPal ou carte bancaire</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePaymentMethod('crypto')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    activePaymentMethod === 'crypto'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">🪙</span>
                  <div>
                    <div className="text-xs font-bold text-white">Crypto USDT (TRC-20)</div>
                    <div className="text-[11px] text-slate-400">Frais réduits • Sans intermédiaire</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. BaridiMob Specific Instructions & RIP */}
            {(activePaymentMethod === 'baridimob' || activePaymentMethod === 'ccp') && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 space-y-3.5 text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Coordonnées Officielles BaridiMob :</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Bénéficiaire Officiel Certifié</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Numéro RIP BaridiMob :</span>
                    <div className="flex items-center justify-between gap-1.5">
                      <strong className="font-mono text-amber-300 text-xs font-bold tracking-wider select-all">
                        {paymentGateways.baridimob?.credentials?.accountRip || '007 99999 0023456789 42'}
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          const rawRip = (paymentGateways.baridimob?.credentials?.accountRip || '00799999002345678942').replace(/\s+/g, '');
                          navigator.clipboard.writeText(rawRip);
                          setCopiedRip(true);
                          showToast('Numéro RIP copié !', 'success');
                          setTimeout(() => setCopiedRip(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shrink-0 border border-slate-700"
                      >
                        {copiedRip ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copier le RIP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Titulaire du Compte :</span>
                    <strong className="text-white text-xs block truncate" title={paymentGateways.baridimob?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES'}>
                      {paymentGateways.baridimob?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES (ALGÉRIE)'}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      CCP : {paymentGateways.baridimob?.credentials?.accountCcp || '23456789 Clé 42'}
                    </span>
                  </div>
                </div>

                {/* Instructions in French & Local Dialect */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Instructions de commande :</span>
                  </div>
                  <p>
                    1. Effectuez le virement du montant exact via votre application <strong>BaridiMob</strong> vers le RIP ci-dessus.
                  </p>
                  <p className="text-amber-200 font-medium">
                    2. Cliquez ci-dessous sur <strong>&laquo; J&apos;ai effectué le paiement &raquo;</strong> pour téléverser la capture de votre reçu et recevoir immédiatement votre clé.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Customer Information (Email required for Key Delivery!) */}
            <div className="space-y-3.5 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Destinataire de la Clé Digitale
                </span>
                <span className="text-[10px] text-rose-400 lowercase font-medium">
                  * e-mail obligatoire
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Mohamed"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Larbi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-bold text-cyan-300">
                    Adresse E-mail (Où envoyer votre clé) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Numéro de Téléphone (WhatsApp / SMS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +213 555 12 34 56"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. Summary & Price Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Articles dans le panier ({cart.length}) :</span>
                <span className="font-mono font-medium text-white">
                  {formatPrice(cartTotal, selectedCurrency)}
                </span>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Réduction promo ({appliedPromo.code}) :</span>
                  <span className="font-mono">
                    -{formatPrice(discountAmount, selectedCurrency)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400">
                <span>Frais de livraison :</span>
                <span className="font-mono text-emerald-400 font-semibold">0 (Instantanée)</span>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total à Régler :</span>
                <span className="text-cyan-400 font-mono text-lg font-bold">
                  {formatPrice(finalTotal, selectedCurrency)}
                </span>
              </div>
            </div>

            {/* 6. Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-950 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98 ${
                activePaymentMethod === 'baridimob' || activePaymentMethod === 'ccp'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-white shadow-cyan-500/25'
              }`}
            >
              {isSubmitting ? (
                <span>Traitement sécurisé en cours...</span>
              ) : activePaymentMethod === 'baridimob' || activePaymentMethod === 'ccp' ? (
                <>
                  <Upload className="w-4 h-4" />
                  <span>J&apos;ai effectué le paiement (Transmettre mon reçu)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Payer &amp; Obtenir ma Clé Immédiatement ({formatPrice(finalTotal, selectedCurrency)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
