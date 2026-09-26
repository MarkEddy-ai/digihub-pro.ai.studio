'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { NovalysLogo } from '@/components/ui/NovalysLogo';
import { Order, OrderStatus } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  KeyRound,
  Lock,
  Sparkles,
  AlertCircle,
  FileText,
  Smartphone,
  Zap,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

function OrderPaymentContent({ orderId }: { orderId: string }) {
  const {
    orders,
    paymentGateways,
    submitOrderPaymentProof,
    validateAndDeliverOrder,
    formatPrice,
    showToast,
  } = useShop();

  // Find targeted order
  const order = orders.find(
    (o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase()
  );

  // BaridiMob settings
  const bmSettings = paymentGateways.baridimob;
  const currentRip = bmSettings?.credentials?.accountRip || '007 99999 0023456789 42';
  const currentHolder = bmSettings?.credentials?.accountHolder || 'NOVALYS DIGITAL SERVICES (ALGÉRIE)';
  const currentCcp = bmSettings?.credentials?.accountCcp || '23456789 Clé 42';

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(order?.payment_proof_url || null);
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRip, setCopiedRip] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // If order already has a proof
  useEffect(() => {
    if (order?.payment_proof_url && !previewUrl) {
      setPreviewUrl(order.payment_proof_url);
    }
  }, [order?.payment_proof_url, previewUrl]);

  const handleCopyRip = () => {
    const rawRip = currentRip.replace(/\s+/g, '');
    navigator.clipboard.writeText(rawRip);
    setCopiedRip(true);
    showToast('Numéro RIP copié dans le presse-papiers !', 'success');
    setTimeout(() => setCopiedRip(false), 2500);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    showToast('Clé de licence copiée !', 'success');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('Le fichier est trop volumineux (max 10 Mo).', 'warning');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!previewUrl && !selectedFile) {
      showToast('Veuillez sélectionner une capture d\'écran de votre reçu BaridiMob.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const finalProof = previewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80';
      submitOrderPaymentProof(order.id, finalProof, transactionRef.trim() || undefined);
      setIsSubmitting(false);
    }, 600);
  };

  // Simulation tool for direct test in UI
  const handleSimulateAdminValidation = () => {
    if (!order) return;
    const res = validateAndDeliverOrder(order.id);
    if (res.success) {
      showToast('Simulation : Commande validée par l\'administrateur ! Clé débloquée.', 'success');
    }
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white">Commande introuvable</h1>
        <p className="text-xs text-slate-400">
          La référence de commande spécifiée n&apos;existe pas ou a été archivée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
        >
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
    );
  }

  const isDelivered = order.status === 'completed' || order.status === 'delivered';
  const hasProof = !!order.payment_proof_url || (order.status === 'pending_verification');

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <NovalysLogo variant="store" size="md" />

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">
              Support prioritaire :
            </span>
            <a
              href="https://wa.me/213550123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Assistance WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Status Card Header */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Commande
                </span>
                <span className="font-mono font-black text-cyan-400 text-sm bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/60">
                  {order.orderNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Finalisation du Paiement BaridiMob
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Client : <strong className="text-slate-200">{order.customer.firstName} {order.customer.lastName}</strong> • {order.customer.phone}
              </p>
            </div>

            {/* Dynamic Status Badge */}
            <div className="self-start sm:self-center">
              {isDelivered ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Paiement Validé &amp; Clé Débloquée</span>
                </div>
              ) : hasProof ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>En attente de vérification par l&apos;équipe</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Reçu en attente d&apos;envoi</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Summary */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Récapitulatif de la commande :
            </span>
            <div className="divide-y divide-slate-800/80 bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                      ⚡
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[10px] text-slate-400">Quantité : {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-white">
                    {formatPrice(item.unitPrice * item.quantity, order.currency)}
                  </div>
                </div>
              ))}

              <div className="pt-3 mt-1 flex items-center justify-between text-xs font-bold border-t border-slate-800">
                <span className="text-slate-300">Montant total exact à verser :</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {formatPrice(order.total_amount || order.total, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= IF DELIVERED: SHOW UNLOCKED KEY VAULT ================= */}
        {isDelivered && (
          <div className="bg-gradient-to-br from-emerald-950/40 via-[#0e1626] to-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 font-black text-xl">
                🔑
              </span>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Votre Licence Numérique Débloquée !</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </h2>
                <p className="text-xs text-slate-300">
                  Votre paiement a été validé avec succès. Conservez précieusement votre clé ci-dessous.
                </p>
              </div>
            </div>

            {/* Glowing Secret Key Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
                <span>Clé d&apos;Activation Officielle (Retail / OEM) :</span>
                <span className="text-[10px] text-emerald-400 font-mono">Garantie 100% Fonctionnelle</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-slate-950 border-2 border-emerald-500/40 rounded-2xl px-4 py-3 font-mono font-black text-emerald-400 text-sm tracking-wider shadow-inner truncate select-all">
                  {order.delivered_secret_data || 'W269N-WFGWX-YVC9B-4J6C9-T83GX'}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyKey(order.delivered_secret_data || 'W269N-WFGWX-YVC9B-4J6C9-T83GX')}
                  className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copiée !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 stroke-[2.5]" />
                      <span>Copier ma Clé</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step by step activation instructions */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Guide d&apos;Activation Immédiate :</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>Ouvrez les <strong>Paramètres</strong> de votre appareil ou le lanceur officiel du logiciel.</li>
                <li>Rendez-vous dans la section <strong>Activation / Clé de produit</strong>.</li>
                <li>Collez votre clé ci-dessus et cliquez sur <strong>Activer</strong>.</li>
                <li>L&apos;activation est immédiate et permanente. Un email récapitulatif vous a également été envoyé.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ================= INSTRUCTIONS DE VIREMENT BARIDIMOB ================= */}
        {!isDelivered && (
          <div className="bg-[#0e1626] border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Coordonnées Officielles BaridiMob</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Compte Certifié NOVALYS</span>
            </div>

            {/* Official RIP with Copy Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Numéro RIP BaridiMob (20 chiffres) :
                </span>
                <div className="flex items-center justify-between gap-2">
                  <strong className="font-mono text-amber-300 text-sm tracking-wider select-all font-bold">
                    {currentRip}
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyRip}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer shrink-0"
                    title="Copier le RIP"
                  >
                    {copiedRip ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Titulaire du Compte :
                </span>
                <div className="font-bold text-white text-xs truncate" title={currentHolder}>
                  {currentHolder}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  CCP : {currentCcp}
                </div>
              </div>
            </div>

            {/* Instructions in French & Dialect */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5 text-xs text-amber-200">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Instructions de paiement (تعليمات الدفع) :</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                1. Effectuez le virement du montant exact (<strong>{formatPrice(order.total_amount || order.total, 'DZD')}</strong>) via votre application <strong>BaridiMob</strong> vers le RIP ci-dessus.
                <br />
                <span className="text-amber-300 font-medium">
                  2. Khallass b BaridiMob w b3ath la capture d&apos;écran ta3 le reçu lta7t bech tewsslek la clé direct !
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ================= UPLOAD ZONE OR REASSURANCE MESSAGE ================= */}
        {!isDelivered && (
          <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Preuve de Virement (Capture du Reçu)</span>
              </h3>
              {hasProof && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Reçu Enregistré
                </span>
              )}
            </div>

            {/* Reassurance Message if proof is already uploaded */}
            {hasProof && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Preuve bien reçue ! Vérification en cours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Votre paiement est en cours de vérification par notre équipe technique. Dès confirmation de la réception sur notre compte BaridiMob, votre clé de licence numérique sera débloquée <strong>immédiatement sur cette page</strong> et transmise par email à <strong className="text-white">{order.customer.email}</strong>.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Délai moyen de validation : <strong>2 à 5 minutes</strong> (Opérationnel 7j/7)</span>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Téléverser la capture d&apos;écran de votre reçu BaridiMob (PNG, JPG, PDF) * :
                </label>

                <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center transition-all bg-slate-950/60 group">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Reçu BaridiMob"
                        className="max-h-48 mx-auto rounded-xl shadow-lg border border-slate-700 object-contain"
                      />
                      <div className="text-xs text-cyan-300 font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Fichier prêt : {selectedFile ? selectedFile.name : 'recu_baridimob.jpg'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Cliquez ou déposez un nouveau fichier pour remplacer
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white">
                        Glissez votre reçu ici ou <span className="text-cyan-400 underline">parcourez vos fichiers</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Format PNG, JPG ou capture BaridiMob claire et lisible
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction ID Optional Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Numéro de transaction BaridiMob (Facultatif mais accélère la validation) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: TR-89218 ou 2026-09-00123"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Envoi de votre reçu en cours...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>{hasProof ? 'Mettre à jour ma preuve de paiement' : 'Envoyer ma preuve de paiement'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick Testing Bar for Admin/Demo */}
        {!isDelivered && (
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mode Démo : Tester la validation en direct</span>
            </span>
            <button
              type="button"
              onClick={handleSimulateAdminValidation}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer"
            >
              Simuler Validation Admin &amp; Débloquer Clé
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrderPaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <ShopProvider>
      <OrderPaymentContent orderId={resolvedParams.orderId} />
    </ShopProvider>
  );
}
