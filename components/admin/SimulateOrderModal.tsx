'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Sparkles, CreditCard, Smartphone, Coins, CheckCircle2, Clock, X, ArrowRight } from 'lucide-react';

interface SimulateOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SimulateOrderModal({ onClose, onSuccess }: SimulateOrderModalProps) {
  const { products, simulateIncomingOrder } = useShop();

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products[0]?.id || 'prod-black-myth-wukong';
  });

  const handleSimulate = (type: 'baridimob_manual' | 'stripe_auto' | 'applepay_auto' | 'crypto_auto') => {
    simulateIncomingOrder(type, selectedProductId);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simulateur de Commandes Réelles</h3>
              <p className="text-xs text-slate-400">Testez en direct les deux workflows de vente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product choice */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Produit concerné par le test :
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.name} ({p.stockCount} clés dispo) - {(p.price_dzd || p.price || 0).toLocaleString('fr-FR')} DA / ${p.price_usd || 20}
              </option>
            ))}
          </select>
        </div>

        {/* Workflow Options */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Choisissez le scénario à déclencher :
          </p>

          {/* Option 1: BaridiMob Manual Workflow */}
          <div
            onClick={() => handleSimulate('baridimob_manual')}
            className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  1. Commande Manuelle BaridiMob / CCP (Algérie)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Statut : En attente
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-8">
              Génère une commande en Dinars (DZD) avec un reçu de virement BaridiMob attaché. Vous pourrez inspecter le reçu et cliquer sur [Valider et Livrer] pour déduire la clé.
            </p>
          </div>

          {/* Option 2: Automated Stripe / Card */}
          <div
            onClick={() => handleSimulate('stripe_auto')}
            className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  <CreditCard className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  2. Commande Automatique Carte / Stripe (USD)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Auto-Complétée
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-8">
              Paiement international instantané. Marque directement la commande comme &apos;completed&apos; et retire instantanément la clé du coffre.
            </p>
          </div>

          {/* Option 3: Automated Apple Pay (SAR) */}
          <div
            onClick={() => handleSimulate('applepay_auto')}
            className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Smartphone className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  3. Commande Automatique Apple Pay (Arabie S. - SAR)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Auto-Complétée
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-8">
              Paiement en Riyals Saoudiens (SAR). Clé délivrée immédiatement au client dès validation bancaire Apple Pay.
            </p>
          </div>

          {/* Option 4: Crypto USDT */}
          <div
            onClick={() => handleSimulate('crypto_auto')}
            className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Coins className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  4. Commande Automatique Crypto USDT TRC20 (USD)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Auto-Complétée
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-8">
              Détection sur la blockchain. Clé transférée instantanément sans intervention humaine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
