'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { CheckCircle2, Copy, Check, MessageSquare, Mail, Phone, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

interface DeliverySuccessModalProps {
  order: Order;
  deliveredKey: string;
  onClose: () => void;
}

export function DeliverySuccessModal({ order, deliveredKey, onClose }: DeliverySuccessModalProps) {
  const { showToast } = useShop();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const productName = order.items?.[0]?.productName || 'Votre produit digital';

  // Ready-to-dispatch message
  const customerMessage = `Bonjour ${order.customer.firstName || 'Client'},

Votre commande ${order.orderNumber} sur NOVALYS Digital est validée et livrée avec succès !

🎮 Produit : ${productName}
🔑 Clé d'activation / Accès :
${deliveredKey}

📌 Instructions d'activation :
1. Lancez votre application ou plateforme officielle.
2. Entrez votre clé d'activation dans les paramètres.
3. Profitez de votre jeu ou service !

Notre support reste à votre écoute 7j/7. Merci de votre confiance !
— L'équipe NOVALYS Digital`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(deliveredKey);
    setCopiedKey(true);
    showToast('Clé d\'activation copiée dans le presse-papier !', 'success');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customerMessage);
    setCopiedMessage(true);
    showToast('Message client complet copié ! Prêt à envoyer.', 'success');
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  // WhatsApp quick link
  const cleanPhone = order.customer.phone.replace(/[^0-9+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customerMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-xl shadow-2xl shadow-emerald-950/40 p-6 space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Commande Validée &amp; Livrée
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Clé Attribuée au Client !
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Brief */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">N° de Commande :</span>
            <span className="font-mono font-bold text-cyan-300">{order.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Client :</span>
            <span className="font-semibold text-white">
              {order.customer.firstName} {order.customer.lastName} ({order.customer.phone})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Produit :</span>
            <span className="font-semibold text-slate-200">{productName}</span>
          </div>
        </div>

        {/* Big Key Display */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Clé d&apos;Activation Retirée du Stock
          </label>
          <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-between gap-3 shadow-inner">
            <span className="font-mono text-sm sm:text-base font-bold text-cyan-300 select-all break-all">
              {deliveredKey}
            </span>

            <button
              onClick={handleCopyKey}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        {/* Client message template */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Message Client Prêt à Envoyer (WhatsApp / SMS / Email)
            </label>
            <button
              onClick={handleCopyMessage}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              {copiedMessage ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedMessage ? 'Message copié !' : 'Copier tout le message'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-sans max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
            {customerMessage}
          </div>
        </div>

        {/* Dispatch Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ouvrir WhatsApp</span>
            </a>

            {order.customer.email && (
              <a
                href={`mailto:${order.customer.email}?subject=${encodeURIComponent(`Votre clé d'activation ${productName} (Commande ${order.orderNumber})`)}&body=${encodeURIComponent(customerMessage)}`}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Envoyer par Email</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
