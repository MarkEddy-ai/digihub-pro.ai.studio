'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { Currency, OrderPaymentMethod, PaymentGatewayId, CustomerDetails } from '@/types';
import { SUPPORTED_CURRENCIES } from '@/data/paymentGateways';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Copy,
  Check,
  Lock,
  Zap,
  Globe2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MultiRegionPaymentModuleProps {
  amountUsd?: number;
  totalAmountInCurrency?: number;
  targetCurrency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
  customer: CustomerDetails;
  onSuccess: (orderId: string, deliveredKey?: string) => void;
  isStandalone?: boolean;
}

export function MultiRegionPaymentModule({
  amountUsd = 25,
  totalAmountInCurrency,
  targetCurrency,
  onCurrencyChange,
  customer,
  onSuccess,
  isStandalone = false,
}: MultiRegionPaymentModuleProps) {
  const {
    selectedCurrency,
    setSelectedCurrency,
    paymentGateways,
    exchangeRates,
    placeOrder,
    formatPrice,
    showToast,
  } = useShop();

  const currentCurrency = targetCurrency || selectedCurrency;

  // Selected payment method
  const [selectedMethod, setSelectedMethod] = useState<OrderPaymentMethod>(() => {
    if (currentCurrency === 'DZD') return 'baridimob';
    if (currentCurrency === 'SAR') return 'mada';
    if (currentCurrency === 'KWD') return 'knet';
    return 'stripe';
  });

  // BaridiMob manual upload proof state
  const [proofUrl, setProofUrl] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80');
  const [proofFileName, setProofFileName] = useState<string>('recu_baridimob_transaction.jpg');
  const [copiedRip, setCopiedRip] = useState(false);

  // Card input states for simulated gateways
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const currencyConfig = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.USD;
  const rate = exchangeRates[currentCurrency] || currencyConfig.rateToUsd;

  // Calculate total amount in target currency
  const finalAmount = useMemo(() => {
    if (totalAmountInCurrency !== undefined) return totalAmountInCurrency;
    return Math.round((amountUsd * rate) * 100) / 100;
  }, [totalAmountInCurrency, amountUsd, rate]);

  const handleSelectRegionCurrency = (code: Currency) => {
    setSelectedCurrency(code);
    if (onCurrencyChange) onCurrencyChange(code);

    if (code === 'DZD') {
      setSelectedMethod('baridimob');
    } else if (code === 'SAR') {
      setSelectedMethod('mada');
    } else if (code === 'KWD') {
      setSelectedMethod('knet');
    } else if (code === 'BHD') {
      setSelectedMethod('benefit_pay');
    } else if (code === 'QAR') {
      setSelectedMethod('naps');
    } else if (code === 'OMR') {
      setSelectedMethod('omannet');
    } else {
      setSelectedMethod('stripe');
    }
  };

  const handleCopyRip = (rip: string) => {
    navigator.clipboard.writeText(rip);
    setCopiedRip(true);
    showToast('Numéro RIP BaridiMob copié !', 'info');
    setTimeout(() => setCopiedRip(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      const url = URL.createObjectURL(file);
      setProofUrl(url);
      showToast(`Capture du reçu "${file.name}" importée avec succès !`, 'success');
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.firstName || !customer.phone) {
      showToast('Veuillez compléter vos coordonnées de contact (Nom, Téléphone).', 'warning');
      return;
    }

    setIsProcessing(true);

    if (selectedMethod === 'baridimob' || selectedMethod === 'ccp') {
      setProcessingStep('Transmission du reçu BaridiMob pour vérification...');
      setTimeout(() => {
        const order = placeOrder(
          customer,
          0,
          selectedMethod,
          currentCurrency,
          'baridimob',
          proofUrl
        );
        setIsProcessing(false);
        showToast('Commande transmise ! L\'administrateur va vérifier votre virement et délivrer votre clé.', 'info');
        onSuccess(order.id);
      }, 1200);
    } else {
      // Automated gateway (Tap Payments / Stripe / PayPal)
      const isTap = ['mada', 'knet', 'benefit_pay', 'naps', 'omannet', 'stc_pay'].includes(selectedMethod);
      setProcessingStep(isTap ? 'Connexion sécurisée à Tap Payments GCC (3D Secure)...' : 'Authentification Stripe / Banque en cours...');

      setTimeout(() => {
        setProcessingStep('Paiement approuvé ! Attribution automatique de votre clé CD...');
        setTimeout(() => {
          const gtwId: PaymentGatewayId = isTap ? 'tap_payments' : selectedMethod === 'paypal' ? 'paypal' : 'stripe';
          const order = placeOrder(
            customer,
            0,
            selectedMethod,
            currentCurrency,
            gtwId
          );
          setIsProcessing(false);
          onSuccess(order.id, order.delivered_secret_data || undefined);
        }, 1000);
      }, 1200);
    }
  };

  const baridimobSettings = paymentGateways.baridimob;
  const tapSettings = paymentGateways.tap_payments;

  return (
    <div className="space-y-6">
      {/* 1. Country & Currency Region Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          Sélectionnez votre Région / Devise :
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(SUPPORTED_CURRENCIES) as Currency[]).map((curCode) => {
            const cur = SUPPORTED_CURRENCIES[curCode];
            const isSelected = curCode === currentCurrency;

            return (
              <button
                key={curCode}
                type="button"
                onClick={() => handleSelectRegionCurrency(curCode)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className="text-xl shrink-0">{cur.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate">{cur.country}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-semibold">
                    {cur.code} ({cur.symbol})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Amount Summary Box */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Montant total à régler :</span>
          <p className="text-xs text-slate-500">Livraison digitale automatique et instantanée garantie</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-white font-mono">
            {formatPrice(finalAmount, currentCurrency)}
          </span>
          {currentCurrency !== 'USD' && (
            <p className="text-[10px] text-slate-400 font-mono">
              ≈ {amountUsd.toFixed(2)} USD
            </p>
          )}
        </div>
      </div>

      {/* 3. Payment Method Options according to Region */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Moyens de Paiement Disponibles pour {currencyConfig.country} :
        </label>

        {/* ALGERIA: BaridiMob & CCP */}
        {currentCurrency === 'DZD' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setSelectedMethod('baridimob')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'baridimob'
                    ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    BM
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Application BaridiMob</span>
                    <span className="text-[10px] text-slate-400">Virement instantané RIP à RIP</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'baridimob'}
                  onChange={() => setSelectedMethod('baridimob')}
                  className="w-4 h-4 text-amber-500"
                />
              </label>

              <label
                onClick={() => setSelectedMethod('ccp')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'ccp'
                    ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    CCP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Bureau de Poste / CCP</span>
                    <span className="text-[10px] text-slate-400">Versement par mandat postal</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'ccp'}
                  onChange={() => setSelectedMethod('ccp')}
                  className="w-4 h-4 text-amber-500"
                />
              </label>
            </div>

            {/* Account Details Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Coordonnées BaridiMob Officielles :
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {baridimobSettings?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Numéro RIP BaridiMob :</span>
                <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-800 font-mono text-xs text-white">
                  <span className="font-bold tracking-wider">
                    {baridimobSettings?.credentials?.accountRip || '007 99999 0023456789 42'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyRip(baridimobSettings?.credentials?.accountRip || '00799999002345678942')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-sans font-semibold"
                  >
                    {copiedRip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRip ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              {/* Upload Receipt Slip */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Joindre la capture du reçu de virement (Obligatoire) :
                </label>

                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-cyan-400 border border-cyan-500/30 cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir une capture</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <span className="text-xs text-slate-400 truncate font-mono">
                    {proofFileName}
                  </span>
                </div>

                {proofUrl && (
                  <div className="mt-2.5 flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <img
                      src={proofUrl}
                      alt="Aperçu reçu"
                      className="w-12 h-12 object-cover rounded border border-slate-700"
                    />
                    <span className="text-[11px] text-slate-300">
                      Reçu prêt pour inspection par l&apos;administrateur.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GULF / GCC: Tap Payments (mada, KNET, STC Pay, Apple Pay) */}
        {['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'].includes(currentCurrency) && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentCurrency === 'SAR' && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mada')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'mada'
                      ? 'bg-purple-950/50 border-purple-500 shadow-md ring-1 ring-purple-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">mada</span>
                  <span className="text-[10px] text-purple-300">مدى Saoudite</span>
                </button>
              )}

              {currentCurrency === 'KWD' && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('knet')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'knet'
                      ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">KNET</span>
                  <span className="text-[10px] text-blue-300">كي نت Koweït</span>
                </button>
              )}

              {currentCurrency === 'BHD' && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('benefit_pay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'benefit_pay'
                      ? 'bg-rose-950/50 border-rose-500 shadow-md ring-1 ring-rose-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">BenefitPay</span>
                  <span className="text-[10px] text-rose-300">Bahreïn</span>
                </button>
              )}

              {currentCurrency === 'QAR' && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('naps')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'naps'
                      ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">NAPS</span>
                  <span className="text-[10px] text-amber-300">Qatar Débit</span>
                </button>
              )}

              {currentCurrency === 'OMR' && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('omannet')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'omannet'
                      ? 'bg-teal-950/50 border-teal-500 shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">OmanNet</span>
                  <span className="text-[10px] text-teal-300">Oman</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedMethod === 'apple_pay'
                    ? 'bg-slate-800 border-white shadow-md ring-1 ring-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs text-white block">Apple Pay</span>
                <span className="text-[10px] text-slate-400">1-Touch Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedMethod === 'card'
                    ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs text-white block">Carte Visa / MC</span>
                <span className="text-[10px] text-cyan-300">Tap Gateway</span>
              </button>
            </div>

            {/* Unified Gateway Card / Mock details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Passerelle Unifiée Sécurisée : <strong className="text-white">Tap Payments GCC</strong>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Instant Delivery
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Numéro de carte"
                  className="col-span-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVV"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* INTERNATIONAL: Stripe & PayPal */}
        {currentCurrency === 'USD' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('stripe')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedMethod === 'stripe'
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs text-white block">Stripe Cards</span>
                <span className="text-[10px] text-indigo-300">Visa / Mastercard</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('paypal')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedMethod === 'paypal'
                    ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs text-white block">PayPal</span>
                <span className="text-[10px] text-blue-300">Express Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedMethod === 'apple_pay'
                    ? 'bg-slate-800 border-white shadow-md ring-1 ring-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs text-white block">Apple Pay</span>
                <span className="text-[10px] text-slate-400">1-Touch Pay</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Passerelle Sécurisée : <strong className="text-white">Stripe / PayPal Encryption</strong>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Instant Key
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Numéro de carte"
                  className="col-span-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Button with dynamic loading state */}
      <div>
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleSubmitPayment}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
            isProcessing
              ? 'bg-slate-800 cursor-not-allowed text-slate-400'
              : currentCurrency === 'DZD'
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 shadow-amber-500/20 hover:scale-[1.01]'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/20 hover:scale-[1.01]'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{processingStep}</span>
            </div>
          ) : currentCurrency === 'DZD' ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Envoyer le Reçu &amp; Valider la Commande ({formatPrice(finalAmount, currentCurrency)})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Payer et Recevoir ma Clé Immédiatement ({formatPrice(finalAmount, currentCurrency)})</span>
            </div>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500 mt-2">
          {currentCurrency === 'DZD'
            ? 'Vérification manuelle rapide sous 15 à 30 minutes après envoi du reçu BaridiMob.'
            : 'Délivrance 100% instantanée : la clé s\'affiche immédiatement sur votre écran après confirmation.'}
        </p>
      </div>
    </div>
  );
}
